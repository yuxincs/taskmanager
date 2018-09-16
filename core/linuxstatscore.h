#pragma once
#include "statscore.h"

class LinuxStatsCore : public StatsCore
{
protected:
    void updateProcesses();
public:
    LinuxStatsCore(int msec);
};
