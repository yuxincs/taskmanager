#include "statscore.h"

StatsCore::StatsCore(int msec)
{
    connect(&this->refreshTimer, &QTimer::timeout, this, &StatsCore::updateProcesses);
    this->refreshTimer.start(msec);
}

void StatsCore::setRefreshRate(int msec)
{
    this->refreshTimer.setInterval(msec);
}

StatsCore::~StatsCore()
{

}

const QSqlTableModel &StatsCore::processModel()
{
    return this->processModel_;
}

void StatsCore::updateProcesses()
{
    // update the processes based on a `ps aux` solution
    QProcess process;
    process.start("ps aux");

}
