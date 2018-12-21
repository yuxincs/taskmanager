#pragma once
#if defined(unix) || defined(__unix__) || defined(__unix)
#include "genericstatscore.h"
#include <unistd.h>

class QProcess;
class QRegularExpression;

class LinuxStatsCore : public GenericStatsCore
{
    Q_OBJECT
public:
    LinuxStatsCore(int msec, QObject *parent=nullptr);
    virtual ~LinuxStatsCore();
protected:
    virtual void gatherStaticInformation();
    virtual void updateSystemInfo();
    virtual void updateProcesses();
private:
    QProcess *process;
    QRegularExpression *regexp;
};

#endif
