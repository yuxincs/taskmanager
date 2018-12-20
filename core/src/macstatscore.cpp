#if defined (__APPLE__)
#include "macstatscore.h"
#include <sys/types.h>
#include <sys/sysctl.h>
#include <QDebug>
#include <QProcess>
#include <QRegularExpression>
#include <QStringListModel>

MacStatsCore::MacStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{

}

MacStatsCore::~MacStatsCore()
{

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
    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Temperature), 0);
    return;
}

#endif
