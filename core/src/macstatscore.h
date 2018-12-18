#pragma once
#include "statscore.h"

class MacStatsCore : public StatsCore
{
public:
    MacStatsCore(int msec, QObject *parent=nullptr);
    virtual ~MacStatsCore();
protected:
    virtual void updateProcesses();
};
