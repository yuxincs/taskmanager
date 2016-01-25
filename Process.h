#ifndef PROCESS_H
#define PROCESS_H
#include "stable.h"

class Process : public QObject
{
public:
    enum Property
    {
        ProcessName = 0,
        UniqueID,
        CPUUsage,
        MemoryUsage,
        DiskUsage,
        NetworkUsage
    };
private:
    QFile stat;
    QFile statm;
    // This list holds process' properties by the order below:
    // Process Name, Unique ID, CPU Usage, Memory Usage, Disk Usage, Network Usage
    QVariantList propertyList;
public:
    explicit Process(unsigned int uid, QObject * parent = nullptr);
    virtual ~Process();
    unsigned int uid() const;
    float cpuUsage() const;
    float memoryUsage() const;
    float diskUsage() const;
    float networkUsage() const;
    QString name() const;
    bool refresh();
    const QVariantList & property();
};

#endif // PROCESS_H
