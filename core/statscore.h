#pragma once
#include "stable.h"
#include "process.h"

class StatsCore : public QObject
{
    Q_OBJECT
private:
    void refreshProcesses();
protected:
    QTimer refreshTimer;
    QList<const Process *> processes;
    virtual void updateProcesses() = 0;
    virtual void killProcess(int pid) = 0;

public:
    StatsCore(int msec);
    virtual ~StatsCore();
    void setRefreshRate(int msec);

signals:
    void processUpdate(const QList<const Process *> processes);
};
