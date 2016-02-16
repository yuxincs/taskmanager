#ifndef SYSTEMMODEL_H
#define SYSTEMMODEL_H
#include "stable.h"

class PerformanceModel : public QObject
{
    Q_OBJECT
private:
    unsigned long lastCpuIdleTime;
    unsigned long curCpuIdleTime;
    unsigned long lastCpuTime;
    unsigned long curCpuTime;

    QVariantList propertyList;
    void refreshCpuTemperatures();
    void refreshCpuTime();
    void refreshMemoryInfo();
    void refreshCpuInfo();
public:
    enum Type
    {
        CpuUtilization, CpuSpeed, Processes, Threads, CpuUpTime, CpuTemperature,
        MemoryUsed, MemoryAvailable, MemoryTotal,
        TypeCount
    };

    PerformanceModel(QObject * parent = nullptr);
    void refresh();
signals:
    void sendSharedData(unsigned int cpuUtilization, unsigned int memoryUtilization, unsigned long totalCpuTimeDiff);
    void updateWidget(const QVariantList & property);
};

#endif // SYSTEMMODEL_H
