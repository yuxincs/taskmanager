#pragma once
#if defined (__APPLE__)
#include "genericstatscore.h"

class MacStatsCore : public GenericStatsCore
{
    Q_OBJECT
public:
    MacStatsCore(int msec, QObject *parent=nullptr);
    virtual ~MacStatsCore();
protected:
    virtual void gatherStaticInformation();
    virtual void updateSystemInfo();
    virtual void updateProcesses();
};

#endif
