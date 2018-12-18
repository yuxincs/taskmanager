#pragma once
#if defined(unix) || defined(__unix__) || defined(__unix)
#include "genericstatscore.h"
#include <unistd.h>

class LinuxStatsCore : public GenericStatsCore
{
    Q_OBJECT
public:
    LinuxStatsCore(int msec, QObject *parent=nullptr);
    virtual ~LinuxStatsCore();
};

#endif
