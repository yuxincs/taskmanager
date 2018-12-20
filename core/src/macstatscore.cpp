#if defined (__APPLE__)
#include "macstatscore.h"
#include <sys/types.h>
#include <sys/sysctl.h>
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
    char stringBuffer[1024];
    size_t stringSize = sizeof(stringBuffer);
    sysctlbyname("machdep.cpu.brand_string", &stringBuffer, &stringSize, nullptr, 0);
    QStringList cpuNameList = QString::fromLocal8Bit(stringBuffer, static_cast<int>(stringSize)).split('@');
    this->staticSystemInfo_[StatsCore::StaticSystemField::CPUName] = cpuNameList[0].remove("CPU").trimmed();
    this->staticSystemInfo_[StatsCore::StaticSystemField::MaxSpeed] = cpuNameList[1].trimmed();
    return;
}

void MacStatsCore::updateSystemInfo()
{
    qDebug() << "mac update system info";
    return;
}

#endif
