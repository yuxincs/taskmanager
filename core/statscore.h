#pragma once
#include "stable.h"

class StatsCore : public QObject
{
    Q_OBJECT
protected:
    QTimer refreshTimer_;
    QSqlDatabase database_;
    QSqlTableModel *processModel_;
    virtual void updateProcesses();

public:
    StatsCore(int msec, QObject *parent=nullptr);
    virtual ~StatsCore();
    void setRefreshRate(int msec);
    const QSqlTableModel &processModel();
    virtual void killProcess(quint64 pid);
};
