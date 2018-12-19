#if defined (__APPLE__)
#include "macstatscore.h"
#include <QDebug>

MacStatsCore::MacStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{

}

MacStatsCore::~MacStatsCore()
{

}

void MacStatsCore::updateProcesses()
{
    qDebug() << "mac update processes";
    return GenericStatsCore::updateProcesses();
}

void MacStatsCore::gatherStaticInformation()
{
    qDebug() << "Gathering static information";
    return;
}

void MacStatsCore::updateSystemInfo()
{
    qDebug() << "mac update system info";
    return;
}

#endif
