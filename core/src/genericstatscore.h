#pragma once
#include <QObject>
#include <QTimer>
#include <QSqlDatabase>
#include "statscore.h"

class QSqlTableModel;

class GenericStatsCore : public StatsCore
{
    Q_OBJECT
public:
    GenericStatsCore(int msec, QObject *parent=nullptr);
    virtual ~GenericStatsCore();
    virtual void setRefreshRate(int msec);
    virtual QAbstractTableModel *processModel();
    virtual void killProcess(quint64 pid);

protected:
    QTimer refreshTimer_;
    QSqlDatabase database_;
    QSqlTableModel *processModel_;
    virtual void updateProcesses();
};
