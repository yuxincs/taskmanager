#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"

LinuxStatsCore::LinuxStatsCore(int msec)
    :StatsCore(msec)
{

}

void LinuxStatsCore::updateProcesses()
{

}

#endif
