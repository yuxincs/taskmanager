#ifdef __APPLE__
#include "macstatscore.h"

MacStatsCore::MacStatsCore(int msec, QObject *parent)
    :StatsCore(msec, parent)
{

}

MacStatsCore::~MacStatsCore()
{

}

void MacStatsCore::updateProcesses()
{
    return StatsCore::updateProcesses();
}

#endif
