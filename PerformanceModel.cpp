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
    refreshMemoryInfo();
    refreshCpuTime();
    refreshCpuTemperatures();

    unsigned int totalDiff = curCpuTime - lastCpuTime;
    unsigned int totalIdleDiff = curCpuIdleTime - lastCpuIdleTime;
    propertyList[CpuUtilization] = 100 * (totalDiff - totalIdleDiff) / totalDiff;

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
    propertyList[MemoryTotal] = 12.0f;
    propertyList[MemoryAvailable] = 6.3f;
    propertyList[MemoryUsed] = 5.7f;
}

