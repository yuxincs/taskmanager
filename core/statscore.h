#pragma once
#include "stable.h"

class StatsCore : public QObject
{
    Q_OBJECT
protected:
    QTimer refreshTimer_;
    QSqlDatabase database_;
    QSqlTableModel *processModel_;
    virtual void updateProcesses() = 0;
    virtual void killProcess(int pid) = 0;

public:
    StatsCore(int msec);
    virtual ~StatsCore();
    void setRefreshRate(int msec);
    const QSqlTableModel &processModel();
};
