#include "statscore.h"

StatsCore::StatsCore(int msec)
{
    connect(&this->refreshTimer_, &QTimer::timeout, this, &StatsCore::updateProcesses);
    this->refreshTimer_.start(msec);
}

void StatsCore::setRefreshRate(int msec)
{
    this->refreshTimer_.setInterval(msec);
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
