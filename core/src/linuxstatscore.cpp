#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"

LinuxStatsCore::LinuxStatsCore(int msec, QObject *parent)
    :StatsCore(msec, parent)
{

}

void LinuxStatsCore::updateProcesses()
{
    return StatsCore::updateProcesses();
}

#endif
