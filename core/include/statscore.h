#pragma once
#include <QtCore>
#include <QtSql>

class StatsCore : public QObject
{
    Q_OBJECT
public:
    enum ProcessField { Name = 0, PID, CPU, Memory, Disk, Network };
    virtual ~StatsCore();
    void setRefreshRate(int msec);
    QSqlTableModel *processModel();
    virtual void killProcess(quint64 pid);
    static StatsCore *createCore(int msec, QObject *parent=nullptr);

signals:
    void shuttingDown();

protected:
    StatsCore(int msec, QObject *parent=nullptr);
    QTimer refreshTimer_;
    QSqlDatabase database_;
    QSqlTableModel *processModel_;
    virtual void updateProcesses();
};
