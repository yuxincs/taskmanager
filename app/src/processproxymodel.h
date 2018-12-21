#pragma once
#include "stable.h"

class ProcessProxyModel : public QIdentityProxyModel
{
public:
    ProcessProxyModel(QObject *parent = nullptr);
    void setCPUUtilization(double utilization);
    void setMemoryUtilization(double utilization);
    virtual ~ProcessProxyModel();

protected:
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const;

private:
    double cpuUtilization__;
    double memoryUtilization__;
};
