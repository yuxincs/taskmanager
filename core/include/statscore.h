#pragma once
#include <QObject>

class QAbstractTableModel;

class StatsCore : public QObject
{
    Q_OBJECT
public:
    enum ProcessField { Name = 0, PID, CPU, Memory, Disk, Network };
    StatsCore() = delete;
    virtual ~StatsCore() { }
    virtual void setRefreshRate(int msec) = 0;
    virtual QAbstractTableModel *processModel() = 0;
    virtual void killProcess(quint64 pid) = 0;
    static StatsCore *createCore(int msec, QObject *parent=nullptr);

signals:
    void shuttingDown();

protected:
    StatsCore(QObject *parent=nullptr) :QObject(parent) { }
};
