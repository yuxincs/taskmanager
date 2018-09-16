#include "statscore.h"

StatsCore::StatsCore()
{

}

void StatsCore::setRefreshRate(int msec)
{
    this->refreshTimer.setInterval(msec);
}
