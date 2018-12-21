#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"
#include <QFile>
#include <QDebug>
#include <QStringListModel>
#include <QRegularExpression>
#include <QTime>
#include <QDir>

LinuxStatsCore::LinuxStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{
    this->curCpuTime = this->curCpuUseTime = this->lastCpuTime = this->lastCpuUseTime = 0;
}

LinuxStatsCore::~LinuxStatsCore()
{

}

void LinuxStatsCore::updateProcesses()
{
    return GenericStatsCore::updateProcesses();
}

void LinuxStatsCore::gatherStaticInformation()
{
    qDebug() << "Gathering linux static information";
    // get total memory
    QFile meminfo("/proc/meminfo");
    QRegularExpression rx;
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemTotal:\\s+([0-9]+) kB");
        this->staticSystemInfo_[StatsCore::StaticSystemField::TotalMemory] = QString::number(rx.match(content).captured(1).toLongLong() * 1024);
    }
    else
        qWarning("Cannot open /proc/meminfo for statistics");

    // update cpu info
    QFile cpuinfo("/proc/cpuinfo");
    if(cpuinfo.open(QIODevice::ReadOnly))
    {
        QString content(cpuinfo.readAll());
        rx.setPattern("model name\\s+:\\s+(.*)");
        QStringList cpuNameList = rx.match(content).captured(1).split('@');
        this->staticSystemInfo_[StatsCore::StaticSystemField::CPUName] = cpuNameList[0].remove("CPU").trimmed();
        this->staticSystemInfo_[StatsCore::StaticSystemField::MaxSpeed] = cpuNameList[1].trimmed();
        rx.setPattern("cpu cores\\s+:\\s+([0-9]+)");
        this->staticSystemInfo_[StatsCore::StaticSystemField::Cores] = rx.match(content).captured(1);
        rx.setPattern("siblings\\s+:\\s+([0-9]+)");
        this->staticSystemInfo_[StatsCore::StaticSystemField::LogicalProcessors] = rx.match(content).captured(1);
        cpuinfo.close();
    }
    else
        qWarning("Cannot open /proc/cpuinfo for statistics");

    // TODO: cannot get this information without sudo
    // best we can do is:
    // > sudo lshw -short -C memory
    // > sudo dmidecode --type memory
    this->staticSystemInfo_[StatsCore::StaticSystemField::MemorySpeed] = "No Data";
    this->staticSystemInfo_[StatsCore::StaticSystemField::MemorySockets] = "No Data";
    return;
}

void LinuxStatsCore::updateSystemInfo()
{
    qDebug() << "Linux update system information";
    QRegularExpression rx;

    // update utilization
    // store last cpu time
    this->lastCpuTime = this->curCpuTime;
    this->lastCpuUseTime = this->curCpuUseTime;

    // read current total cpu time
    QFile stat("/proc/stat");
    if(stat.open(QIODevice::ReadOnly))
    {
        QStringList statContent = QString(stat.readLine()).split(' ', QString::SkipEmptyParts);
        statContent.removeFirst();
        this->curCpuTime = 0;
        for(int i = 0;i < statContent.size(); i ++)
            curCpuTime += statContent.at(i).toULongLong();

        this->curCpuUseTime = this->curCpuTime - statContent.at(3).toULongLong();

        // update process number
        QString content(stat.readAll());
        rx.setPattern("processes ([0-9]+)");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Processes), rx.match(content).captured(1));

        stat.close();
    }
    else
        qWarning("Cannot open /proc/stat for statistics");

    quint64 totalDiff = curCpuTime - lastCpuTime;
    quint64 totalUseDiff = curCpuUseTime - lastCpuUseTime;
    if(totalDiff == 0)
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Utilization), 0);
    else
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Utilization), 100.0 * static_cast<double>(totalUseDiff) / static_cast<double>(totalDiff));

    if(this->curCpuTime == 0) // hasn't updated for the first time
        this->systemModel_->setData(this->systemModel_->index(StatsCore::Utilization), 0);

    // update temperature
    QFile inputFile("/sys/class/hwmon/hwmon0/temp1_input");
    if(inputFile.open(QIODevice::ReadOnly))
    {
        QString content(inputFile.readAll());
        if(!content.isEmpty())
            this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Temperature), QString::number(content.trimmed().toInt() / 1000.0, 'f', 1));
        inputFile.close();
    }
    else
        qWarning("Cannot open /sys/class/hwmon/hwmon0/temp1_input for statistics");
    qDebug() << QDir("/sys/class/hwmon/hwmon0").entryList(QDir::NoDotAndDotDot);

    // update memory information
    QFile meminfo("/proc/meminfo");
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemAvailable:\\s+([0-9]+) kB");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::AvailableMemory), rx.match(content).captured(1).toULongLong() * 1024);
        rx.setPattern("Active:\\s+([0-9]+) kB");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UsedMemory), rx.match(content).captured(1).toULongLong() * 1024);
        rx.setPattern("Buffers:\\s+([0-9]+) kB");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::CachedMemory), rx.match(content).captured(1).toULongLong() * 1024);
        meminfo.close();
    }
    else
        qWarning("Cannot open /proc/meminfo for statistics");

    QFile cpuinfo("/proc/cpuinfo");
    if(cpuinfo.open(QIODevice::ReadOnly))
    {
        QString content(cpuinfo.readAll());
        rx.setPattern("cpu MHz\\s+:\\s+([0-9]+\\.[0-9]+)");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::CPUSpeed),  QString::number(rx.match(content).captured(1).toDouble() / 1024, 'f', 1) + " GHz");
        cpuinfo.close();
    }
    else
        qWarning("Cannot open /proc/cpuinfo for statistics");

    // update up time
    QFile uptime("/proc/uptime");
    if(uptime.open(QIODevice::ReadOnly))
    {
        QStringList uptimeContent = QString(uptime.readAll()).split(" ");
        double seconds = uptimeContent.at(0).toDouble();
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UpTime), QTime::fromMSecsSinceStartOfDay(static_cast<int>(seconds * 1000)).toString());
        uptime.close();
    }
    else
        qWarning("Cannot open /proc/uptime for statistics");
    return;
}

#endif
