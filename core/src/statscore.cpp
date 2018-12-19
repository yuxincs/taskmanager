#include "statscore.h"
#include "genericstatscore.h"
#include "macstatscore.h"
#include "linuxstatscore.h"

StatsCore *StatsCore::createCore(int msec, QObject *parent)
{
    #if defined(unix) || defined(__unix__) || defined(__unix)
    return new LinuxStatsCore(msec, parent);
    #elif defined(__APPLE__)
    return new MacStatsCore(msec, parent);
    #else
    return nullptr;
    #endif
}
