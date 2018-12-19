#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"

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
    return;
}

void LinuxStatsCore::updateSystemInfo()
{
    return;
}

#endif
