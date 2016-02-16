#include "PerformanceModel.h"
#include "UsagePlot.h"

PerformanceModel::PerformanceModel(QObject * parent)
    :QObject(parent)
{
    lastCpuTime = curCpuTime = lastCpuIdleTime = curCpuIdleTime =  -1;
    for(int i = 0; i < TypeCount; i ++)
        propertyList.append(0);
}


void PerformanceModel::refresh()
{
    refreshCpuInfo();
    refreshMemoryInfo();
    refreshCpuTime();
    refreshCpuTemperatures();

    unsigned int totalDiff = curCpuTime - lastCpuTime;
    unsigned int totalIdleDiff = curCpuIdleTime - lastCpuIdleTime;
    propertyList[CpuUtilization] = 100 * totalIdleDiff / totalDiff;

    unsigned int memoryUtilization = 100 * (propertyList[MemoryTotal].toUInt() - propertyList[MemoryAvailable].toUInt()) / propertyList[MemoryTotal].toUInt();

    if(lastCpuTime > 0)
        emit sendSharedData(propertyList[CpuUtilization].toUInt(), memoryUtilization, totalDiff);

    updateWidget(propertyList);
}

void PerformanceModel::refreshCpuTemperatures()
{
        QFile inputFile(QString("/sys/class/hwmon/hwmon1/temp1_input"));
        if(!inputFile.open(QIODevice::ReadOnly))
            return;
        propertyList[CpuTemperature] = QString(inputFile.readAll()).toInt() / 1000;
}

void PerformanceModel::refreshCpuTime()
{
    // store last cpu time
    lastCpuTime = curCpuTime;
    lastCpuIdleTime = curCpuIdleTime;

    // read current total cpu time
    QFile stat("/proc/stat");
    stat.open(QIODevice::ReadOnly);
    QStringList statContent = QString(stat.readLine()).split(" ");
    curCpuTime = 0;
    for(int i = 1;i < statContent.size(); i ++)
        curCpuTime += statContent.at(i).toULong();

    curCpuIdleTime = statContent.at(4).toULong();
}

void PerformanceModel::refreshMemoryInfo()
{
    QRegularExpression rx;
    QFile meminfo("/proc/meminfo");
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemTotal:(.*) kB\n");
        propertyList[MemoryTotal] = rx.match(content).captured(1).toUInt();

        rx.setPattern("MemAvailable:(.*) kB\n");
        propertyList[MemoryAvailable] = rx.match(content).captured(1).toUInt();

        rx.setPattern("Cached:(.*) kB\n");
        propertyList[MemoryCached] = rx.match(content).captured(1).toUInt();
    }
}

void PerformanceModel::refreshCpuInfo()
{
    // refresh uptime
    QFile uptime("/proc/uptime");
    if(uptime.open(QIODevice::ReadOnly))
    {
        QStringList uptimeContent = QString(uptime.readAll()).split(" ");
        int seconds = uptimeContent.at(0).toFloat();

        propertyList[CpuUpTime] = QTime(0, 0).addSecs(seconds);
    }

    QRegularExpression rx;
    QFile cpuinfo("/proc/cpuinfo");
    if(cpuinfo.open(QIODevice::ReadOnly))
    {
        QString content(cpuinfo.readAll());
        rx.setPattern("cpu MHz		: (.*)\n");
        propertyList[CpuSpeed] = rx.match(content).captured(1).toFloat();
    }

    QFile stat("/proc/stat");
    if(stat.open(QIODevice::ReadOnly))
    {
        QString content(stat.readAll());
        rx.setPattern("processes (.*)\n");
        propertyList[Processes] = rx.match(content).captured(1);
    }
}

