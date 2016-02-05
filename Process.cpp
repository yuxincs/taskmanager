#include "Process.h"

Process::Process(unsigned int id, QObject * parent)
    :QObject(parent)
{
    // Append info into the property list
    propertyList << QString() << id << 0.0f << 0.0f << 0.0f << 0.0f;

    // Open files
    QFile stat(QString("/proc/%1/stat").arg(id));
    QFile statm(QString("/proc/%1/statm").arg(id));
    if(!stat.exists() || !statm.exists())
        return;
    if(!stat.open(QIODevice::ReadOnly) || !statm.open(QIODevice::ReadOnly))
        return;

    // Get process name
    QString statContent(stat.readAll());
    QString name = statContent.split(" ").at(1);
    name.chop(1);
    name.remove(0, 1);

    propertyList[ProcessName] = name;

    stat.close();
    statm.close();
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
    // Open files
    QFile stat(QString("/proc/%1/stat").arg(propertyList.at(ID).toUInt()));
    QFile statm(QString("/proc/%1/statm").arg(propertyList.at(ID).toUInt()));
    if(!stat.exists() || !statm.exists())
        return false;
    if(!stat.open(QIODevice::ReadOnly) || !statm.open(QIODevice::ReadOnly))
        return false;

    QString statContent = stat.readAll();
    QStringList statItemList = statContent.split(" ");

    QString statmContent = statm.readAll();
    QStringList statmItemList = statmContent.split(" ");

    propertyList[MemoryUsage] = statmItemList.at(1).toUInt() * (getpagesize() / 1024);

    stat.close();
    statm.close();
    return true;
}
