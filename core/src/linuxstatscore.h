#pragma once
#if defined(unix) || defined(__unix__) || defined(__unix)
#include "statscore.h"
#include <unistd.h>

class LinuxStatsCore : public StatsCore
{
protected:
    void updateProcesses();
public:
    LinuxStatsCore(int msec);
};

#endif
