#pragma once
#include "stable.h"
#include "process.h"

class StatsCore : public QObject
{
    Q_OBJECT
protected:
    QTimer refreshTimer;

public:
    StatsCore();
    void setRefreshRate(int msec);

signals:
    void processes(const QList<const Process *> processes);
};
