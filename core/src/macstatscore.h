#pragma once
#include "genericstatscore.h"

class MacStatsCore : public GenericStatsCore
{
    Q_OBJECT
public:
    MacStatsCore(int msec, QObject *parent=nullptr);
    virtual ~MacStatsCore();
protected:
    virtual void updateProcesses();
};
