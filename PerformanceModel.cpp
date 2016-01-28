#include "PerformanceModel.h"

PerformanceModel::PerformanceModel(QObject * parent)
    :QObject(parent)
{
    // Iterate all temp*_* files
    for(int i = 1;;i++)
    {
        QFile labelFile(QString("/sys/class/hwmon/hwmon1/temp%1_label").arg(i));
        QFile inputFile(QString("/sys/class/hwmon/hwmon1/temp%1_input").arg(i));

        // If files don't exist stop iteration
        if(!labelFile.open(QIODevice::ReadOnly) || !inputFile.open(QIODevice::ReadOnly))
            break;

        QString label(labelFile.readAll());
        float temp = QString(inputFile.readAll()).toInt() / 1000;
        cpuTempList.append(new Temperature(label, temp));
    }
}

const QList<Temperature *> & PerformanceModel::cpuTemperatureList()
{
    return cpuTempList;
}

void PerformanceModel::refresh()
{
    refreshCpuTemperatures();
}

void PerformanceModel::refreshCpuTemperatures()
{
    for(int i = 1; i < cpuTempList.size() + 1; i ++)
    {
        QFile inputFile(QString("/sys/class/hwmon/hwmon1/temp%1_input").arg(i));
        if(!inputFile.open(QIODevice::ReadOnly))
            return;

        float temp = QString(inputFile.readAll()).toInt() / 1000;
        cpuTempList[i - 1]->setValue(temp);
    }
}


