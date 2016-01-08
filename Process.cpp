#include "Process.h"

Process::Process(const QDir & procDir, QObject * parent)
    :QObject(parent)
{
    uid = procDir.dirName().toInt();
    cpu = 0;
    net = 0;
    disk = 0;
    memory = 0;

    // Open files
    stat.setFileName(QString("/proc/%1/stat").arg(uid));
    statm.setFileName(QString("/proc/%1/statm").arg(uid));
    stat.open(QIODevice::ReadOnly);
    statm.open(QIODevice::ReadOnly);

    // Set process name
    QString statContent(stat.readAll());
    processName = statContent.split(" ").at(1);
    processName.chop(1);
    processName.remove(0, 1);
    refresh();
}

Process::~Process()
{

}

bool Process::refresh()
{
    stat.close();
    statm.close();

    // If the process doesn't exist anymore
    if(!stat.open(QIODevice::ReadOnly) || !statm.open(QIODevice::ReadOnly))
        return false;

    QString statContent = stat.readAll();
    QStringList statItemList = statContent.split(" ");

    QString statmContent = statm.readAll();
    QStringList statmItemList = statmContent.split(" ");

    memory = statmItemList.at(1).toFloat() * (getpagesize() >> 10);
    memory /= 1024;

    return true;
}

float Process::cpuOccupancy() const
{
    return cpu;
}

unsigned int Process::uniqueID() const
{
    return uid;
}

float Process::diskOccupancy() const
{
    return disk;
}

float Process::networkOccupancy() const
{
    return net;
}

float Process::memoryOccupancy() const
{
    if(memory < 0.1)
        return 0;
    else
        return memory;
}

const QString & Process::name() const
{
    return processName;
}
