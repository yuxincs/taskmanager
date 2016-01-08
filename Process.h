#ifndef PROCESS_H
#define PROCESS_H
#include "stable.h"

class Process : public QObject
{
private:
    QFile stat;
    QFile statm;
    QString processName;
    unsigned int uid;
    float cpu;
    float memory;
    float disk;
    float net;
public:
    explicit Process(const QDir & procDir, QObject * parent = nullptr);
    virtual ~Process();
    unsigned int uniqueID() const;
    float cpuOccupancy() const;
    float memoryOccupancy() const;
    float diskOccupancy() const;
    float networkOccupancy() const;
    const QString & name() const;
    bool refresh();

};

#endif // PROCESS_H
