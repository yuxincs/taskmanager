#include "Process.h"

Process::Process(unsigned int id, QObject * parent)
    :QObject(parent)
{
    // Open files
    stat.setFileName(QString("/proc/%1/stat").arg(id));
    statm.setFileName(QString("/proc/%1/statm").arg(id));
    stat.open(QIODevice::ReadOnly);
    statm.open(QIODevice::ReadOnly);

    // Append process name
    QString statContent(stat.readAll());
    QString name = statContent.split(" ").at(1);
    name.chop(1);
    name.remove(0, 1);
    propertyList.append(name);

    // Append process Uid
    propertyList.append(id);

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

const QVariant & Process::property(int propertyName)
{
    return propertyList.at(propertyName);
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

    propertyList[MemoryUsage] = statmItemList.at(1).toUInt() * (getpagesize() / 1024);

    return true;
}
