#pragma once
#include <QObject>

class QAbstractItemModel;

class StatsCore : public QObject
{
    Q_OBJECT
public:
    enum ProcessField { Name = 0, PID, CPU, Memory, Disk, Network };
    enum SystemField { CPUName = 0, Utilization, CPUSpeed, Processes, Temperature, UpTime, MaxSpeed, Cores, LogicalProcessors,
                       UsedMemory, AvailableMemory, CachedMemory, ReservedMemory, MemorySpeed, MemorySockets, TotalSystemProperties};
    StatsCore() = delete;
    virtual ~StatsCore() { }
    virtual void setRefreshRate(int msec) = 0;
    virtual QAbstractItemModel *processModel() = 0;
    virtual void killProcess(quint64 pid) = 0;
    static StatsCore *createCore(int msec, QObject *parent=nullptr);

signals:
    void shuttingDown();

protected:
    StatsCore(QObject *parent=nullptr) :QObject(parent) { }
};
