#if defined (__APPLE__)
#include "macstatscore.h"
#include <sys/types.h>
#include <sys/sysctl.h>
#include <mach/host_info.h>
#include <mach/mach_host.h>
#include <QDebug>
#include <QProcess>
#include <QRegularExpression>
#include <QStringListModel>
#include <QDateTime>

MacStatsCore::MacStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{
    this->regexp = new QRegularExpression("Processes: ([0-9]+).*CPU usage: ([0-9]+\\.[0-9]*)% user, ([0-9]+\\.[0-9]*)% sys, [0-9]+\\.[0-9]*% idle");
    this->process = new QProcess(this);
    connect(this->process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            [=] {
        QRegularExpressionMatch match = this->regexp->match(this->process->readAllStandardOutput().mid(0, 500).simplified());
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Processes), match.captured(1));
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Utilization),
                                    QString::number(match.captured(2).toDouble() + match.captured(3).toDouble(), 'f', 2));
    });
}

MacStatsCore::~MacStatsCore()
{
    disconnect(this->process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            nullptr, nullptr);
    this->process->kill();
    this->process->waitForFinished();
    delete this->process;
    delete this->regexp;
}

void MacStatsCore::updateProcesses()
{
    qDebug() << "Update process information";
    return GenericStatsCore::updateProcesses();
}

void MacStatsCore::gatherStaticInformation()
{
    qDebug() << "Gathering static information";
    char stringBuffer[1024];
    size_t stringSize = sizeof(stringBuffer);
    int intBuffer = -1;
    size_t intSize = sizeof(intBuffer);
    long longBuffer = -1;
    size_t longSize = sizeof(longBuffer);
    sysctlbyname("machdep.cpu.brand_string", &stringBuffer, &stringSize, nullptr, 0);
    QStringList cpuNameList = QString::fromLocal8Bit(stringBuffer, static_cast<int>(stringSize)).split('@');
    this->staticSystemInfo_[StatsCore::StaticSystemField::CPUName] = cpuNameList[0].remove("CPU").trimmed();
    this->staticSystemInfo_[StatsCore::StaticSystemField::MaxSpeed] = cpuNameList[1].trimmed();
    sysctlbyname("machdep.cpu.core_count", &intBuffer, &intSize, nullptr, 0);
    this->staticSystemInfo_[StatsCore::StaticSystemField::Cores] = QString::number(intBuffer);
    sysctlbyname("machdep.cpu.thread_count", &intBuffer, &intSize, nullptr, 0);
    this->staticSystemInfo_[StatsCore::StaticSystemField::LogicalProcessors] = QString::number(intBuffer);
    sysctlbyname("hw.memsize", &longBuffer, &longSize, nullptr, 0);
    this->staticSystemInfo_[StatsCore::StaticSystemField::TotalMemory] = QString::number(longBuffer);
    QProcess process;
    process.start("system_profiler", {"SPMemoryDataType", "-detailLevel", "mini"});
    QRegularExpression reg("Speed:\\s+([0-9]+)\\s+MHz");
    reg.optimize();
    process.waitForFinished();
    quint8 socketCount = 0;
    quint32 memorySpeed = 0;
    auto iterator = reg.globalMatch(process.readAllStandardOutput().simplified());
    while(iterator.hasNext())
    {
        quint32 thisSpeed = iterator.next().captured(1).toUInt();
        memorySpeed = thisSpeed > memorySpeed ? thisSpeed : memorySpeed;
        socketCount += 1;
    }
    this->staticSystemInfo_[StatsCore::StaticSystemField::MemorySockets] = QString::number(socketCount);
    this->staticSystemInfo_[StatsCore::StaticSystemField::MemorySpeed] = QString("%1 MHz").arg(memorySpeed);
    return;
}

void MacStatsCore::updateSystemInfo()
{
    qDebug() << "Updating dynamic system information.";
    // update up time
    struct timeval boottime = { 0, 0 };
    size_t timeSize = sizeof(boottime);
    sysctlbyname("kern.boottime", &boottime, &timeSize, nullptr, 0);
    qint64 timeDiff = QDateTime::currentMSecsSinceEpoch() - (boottime.tv_sec * 1000 + static_cast<int>(boottime.tv_usec / 1000.0));
    QTime time = QTime::fromMSecsSinceStartOfDay(static_cast<int>(timeDiff));

    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UpTime), time.toString());
    // TODO: implement temperature retrieval
    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Temperature), 0);
    if(process->state() == QProcess::NotRunning)
        process->start("top -l 1");
    // TODO: find a way to detect CPU Speed
    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::CPUSpeed), "No Data");

    // update memory usage
    // get pagesize
    int pagesize = -1;
    size_t intSize = sizeof(pagesize);
    sysctlbyname("vm.pagesize", &pagesize, &intSize, nullptr, 0);
    mach_msg_type_number_t count = HOST_VM_INFO_COUNT;
    vm_statistics_data_t vmstat;
    memset(&vmstat, 0, sizeof(vmstat));
    if (host_statistics (mach_host_self (), HOST_VM_INFO, (host_info_t) &vmstat, &count) != KERN_SUCCESS)
        qWarning("Failed to get VM statistics.");
    quint64 usedCount = static_cast<quint64>(vmstat.active_count) + static_cast<quint64>(vmstat.wire_count);
    quint64 availableCount = static_cast<quint64>(vmstat.free_count) + static_cast<quint64>(vmstat.inactive_count);
    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UsedMemory), usedCount * static_cast<quint64>(pagesize));
    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::AvailableMemory), availableCount * static_cast<quint64>(pagesize));
    return;
}

#endif
