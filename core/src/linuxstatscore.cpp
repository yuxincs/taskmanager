#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"
#include <QFile>
#include <QDebug>
#include <QStringListModel>
#include <QRegularExpression>
#include <QTime>

LinuxStatsCore::LinuxStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{

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
    return;
}

void LinuxStatsCore::updateSystemInfo()
{
    qDebug() << "Linux update system information";
    // update temperature
    QFile inputFile("/sys/class/hwmon/hwmon0/temp1_input");
    if(!inputFile.open(QIODevice::ReadOnly))
        return;
    this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Temperature), QString(inputFile.readAll()).toInt() / 1000.0);

    // update up time
    QFile uptime("/proc/uptime");
    if(uptime.open(QIODevice::ReadOnly))
    {
        QStringList uptimeContent = QString(uptime.readAll()).split(" ");
        double seconds = uptimeContent.at(0).toDouble();
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UpTime), QTime::fromMSecsSinceStartOfDay(static_cast<int>(seconds * 1000)).toString());
        uptime.close();
    }
    return;
}

#endif
