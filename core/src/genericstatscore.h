#pragma once
#include "statscore.h"

class GenericStatsCore : public StatsCore
{
public:
    GenericStatsCore(int msec, QObject *parent=nullptr);
    virtual ~GenericStatsCore();
};
