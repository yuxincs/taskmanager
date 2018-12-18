#pragma once
#if defined(unix) || defined(__unix__) || defined(__unix)
#include "statscore.h"
#include <unistd.h>

class LinuxStatsCore : public StatsCore
{
protected:
    virtual void updateProcesses();
public:
    LinuxStatsCore(int msec, QObject *parent=nullptr);
    virtual ~LinuxStats();
};

#endif
