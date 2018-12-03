#pragma once
#include "stable.h"
#include "process.h"

class StatsCore : public QObject
{
    Q_OBJECT
protected:
    QTimer refreshTimer;
    QSqlTableModel processModel_;
    virtual void updateProcesses() = 0;
    virtual void killProcess(int pid) = 0;

public:
    StatsCore(int msec);
    virtual ~StatsCore();
    void setRefreshRate(int msec);
    const QSqlTableModel &processModel();
};
