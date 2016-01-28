#ifndef PROCESS_H
#define PROCESS_H
#include "stable.h"

class Process : public QObject
{
public:
    enum Property
    {
        ProcessName = 0,
        ID,
        CPUUsage,
        MemoryUsage,
        DiskUsage,
        NetworkUsage,
        PropertyCount
    };
private:
    QFile stat;
    QFile statm;
    // This list holds process' properties by the order below:
    // Process Name, Unique ID, CPU Usage, Memory Usage, Disk Usage, Network Usage
    QVariantList propertyList;
public:
    explicit Process(unsigned int id, QObject * parent = nullptr);
    virtual ~Process();
    bool refresh();
    const QVariant & property(int propertyName);
};

#endif // PROCESS_H
