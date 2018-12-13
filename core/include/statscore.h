#pragma once
#include <QtCore>
#include <QtSql>

class StatsCore : public QObject
{
    Q_OBJECT
protected:
    QTimer refreshTimer_;
    QSqlDatabase database_;
    QSqlTableModel *processModel_;
    virtual void updateProcesses();

public:
    enum ProcessField { Name = 0, PID, CPU, Memory, Disk, Network };
    StatsCore(int msec, QObject *parent=nullptr);
    virtual ~StatsCore();
    void setRefreshRate(int msec);
    QSqlTableModel *processModel();
    virtual void killProcess(quint64 pid);

private:
    QProcess *process__;
};
