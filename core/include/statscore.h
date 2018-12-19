#pragma once
#include <QObject>

class QAbstractItemModel;

class StatsCore : public QObject
{
    Q_OBJECT
public:
    enum ProcessField { Name = 0, PID, CPU, Memory, Disk, Network };
    enum StaticSystemField { CPUName = 0, MaxSpeed, Cores, LogicalProcessors, MemorySpeed, MemorySockets, TotalStaticProperties };
    enum DynamicSystemField { Utilization = 0, CPUSpeed, Processes, Temperature, UpTime, UsedMemory, AvailableMemory, CachedMemory, ReservedMemory, TotalDyanamicProperties};
    StatsCore() = delete;
    virtual ~StatsCore() { }
    virtual void setRefreshRate(int msec) = 0;
    virtual QAbstractItemModel *processModel() = 0;
    virtual void killProcess(quint64 pid) = 0;
    virtual QAbstractItemModel *systemModel() = 0;
    virtual QStringList staticInformation() = 0;
    static StatsCore *createCore(int msec, QObject *parent=nullptr);

signals:
    void shuttingDown();

protected:
    StatsCore(QObject *parent=nullptr) :QObject(parent) { }
};
