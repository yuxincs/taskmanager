#include "Process.h"

Process::Process(unsigned int uid, QObject * parent)
    :QObject(parent)
{
    // Open files
    stat.setFileName(QString("/proc/%1/stat").arg(uid));
    statm.setFileName(QString("/proc/%1/statm").arg(uid));
    stat.open(QIODevice::ReadOnly);
    statm.open(QIODevice::ReadOnly);

    // Append process name
    QString statContent(stat.readAll());
    QString name = statContent.split(" ").at(1);
    name.chop(1);
    name.remove(0, 1);
    propertyList.append(name);

    // Append process Uid
    propertyList.append(uid);

    // Append Empty CPU Usage, Memory Usage, Disk Usage, Network Usage
    propertyList.append(0.0f);
    propertyList.append(0.0f);
    propertyList.append(0.0f);
    propertyList.append(0.0f);

    refresh();
}

Process::~Process()
{

}

const QVariantList & Process::property()
{
    return propertyList;
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

    propertyList[MemoryUsage] = statmItemList.at(1).toFloat() * (getpagesize() >> 10) / 1024;

    return true;
}

float Process::cpuUsage() const
{
    return propertyList[CPUUsage].toFloat();
}

unsigned int Process::uid() const
{
    return propertyList[UniqueID].toUInt();
}

float Process::diskUsage() const
{
    return propertyList[DiskUsage].toFloat();
}

float Process::networkUsage() const
{
    return propertyList[NetworkUsage].toFloat();
}

float Process::memoryUsage() const
{
    if(propertyList[MemoryUsage].toFloat() < 0.1)
        return 0;
    else
        return propertyList[MemoryUsage].toFloat();
}

QString Process::name() const
{
    return propertyList[ProcessName].toString();
}
