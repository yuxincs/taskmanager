#ifdef __APPLE__
#include "macstatscore.h"

MacStatsCore::MacStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{

}

MacStatsCore::~MacStatsCore()
{

}

void MacStatsCore::updateProcesses()
{
    return GenericStatsCore::updateProcesses();
}

#endif
