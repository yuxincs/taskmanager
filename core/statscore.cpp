#include "statscore.h"

StatsCore::StatsCore(int msec)
{
    connect(&this->refreshTimer, &QTimer::timeout, this, &StatsCore::refreshProcesses);
    //connect(&this->refreshTimer, &QTimer::timeout, this, &StatsCore::)
    this->refreshTimer.start(msec);
}

void StatsCore::setRefreshRate(int msec)
{
    this->refreshTimer.setInterval(msec);
}

void StatsCore::refreshProcesses()
{
    this->updateProcesses();
    emit processUpdate(this->processes);
}
