#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"
#include <QFile>
#include <QDebug>
#include <QStringListModel>

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

    return;
}

#endif
