#ifndef SYSTEMMODEL_H
#define SYSTEMMODEL_H
#include "stable.h"
#include "Temperature.h"

class PerformanceModel : public QObject
{
    Q_OBJECT
private:
    QList<Temperature *> cpuTempList;
    void refreshCpuTemperatures();
public:
    PerformanceModel(QObject * parent = nullptr);

    const QList<Temperature *> & cpuTemperatureList();
public slots:
    void refresh();
};

#endif // SYSTEMMODEL_H
