#include "PerformanceModel.h"

PerformanceModel::PerformanceModel(QObject * parent)
    :QObject(parent)
{
    refresh();
}

const QList<Temperature *> & PerformanceModel::cpuTemperatureList()
{
    return cpuTempList;
}

void PerformanceModel::refresh()
{
    // Refresh cpu temperatures
    refreshCpuTemperatures();
}

void PerformanceModel::refreshCpuTemperatures()
{
    QDir dir("/sys/class/hwmon/hwmon1");

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

        // If the list hasn't been populated
        if(cpuTempList.size() < i)
            cpuTempList.append(new Temperature(label,temp));
        else
            cpuTempList.value(i - 1)->setValue(temp);
    }
}


