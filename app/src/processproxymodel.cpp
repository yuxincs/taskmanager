#include "processproxymodel.h"
#include "statscore.h"

ProcessProxyModel::ProcessProxyModel(QObject *parent)
    : QIdentityProxyModel(parent)
{
    this->cpuUtilization__ = 0;
    this->memoryUtilization__ = 0;
}

void ProcessProxyModel::setCPUUtilization(double utilization)
{
    this->cpuUtilization__ = utilization;
}

void ProcessProxyModel::setMemoryUtilization(double utilization)
{
    this->memoryUtilization__ = utilization;
}

QVariant ProcessProxyModel::data(const QModelIndex &index, int role) const
{
    QVariant unmodifiedData = QIdentityProxyModel::data(index, role);
    if (role == Qt::DisplayRole)
    {
        switch(index.column())
        {
        case StatsCore::ProcessField::CPU:
            return QString("%1 %").arg(unmodifiedData.toString());
        case StatsCore::ProcessField::Memory:
        {
            quint64 memoryInKiB = unmodifiedData.toULongLong();
            if(memoryInKiB < 1024)
                return QString("%1 KB").arg(memoryInKiB);
            else if(memoryInKiB < 1024 * 1024)
                return QString("%1 MB").arg(QString::number(memoryInKiB / 1024.0, 'f', 1));
            else
                return QString("%1 GB").arg(QString::number(memoryInKiB / (1024.0 * 1024.0), 'f', 1));
        }
        case StatsCore::Disk:
            return QString("%1 MB/s").arg(unmodifiedData.toULongLong());
        case StatsCore::Network:
            return QString("%1 Mbps").arg(unmodifiedData.toULongLong());
        }
    }
    else if (role == Qt::BackgroundRole)
    {
        if(index.column() > 1)
        {
            // TODO: determine the percentage
            // default color
            return QBrush(QColor(255, 198, 61, 70));
        }

        return QVariant();
    }
    else if (role == Qt::TextAlignmentRole)
    {
        switch(index.column())
        {
        case StatsCore::ProcessField::Name:
            return static_cast<int>(Qt::AlignLeft) | static_cast<int>(Qt::AlignVCenter);
        case StatsCore::ProcessField::PID:
            return static_cast<int>(Qt::AlignHCenter) | static_cast<int>(Qt::AlignVCenter);
        default:
            return static_cast<int>(Qt::AlignRight) | static_cast<int>(Qt::AlignVCenter);
        }
    }
    return unmodifiedData;
}

QVariant ProcessProxyModel::headerData(int section, Qt::Orientation orientation, int role) const
{
    if(orientation == Qt::Horizontal)
    {
        if (role == Qt::DisplayRole)
        {
            switch(section)
            {
            case StatsCore::ProcessField::Name:
                return QString("Process Name");
            case StatsCore::ProcessField::PID:
                return QString("PID");
            case StatsCore::ProcessField::CPU:
                return QString::number(this->cpuUtilization__, 'f', 1) + " %\n\nCPU";
            case StatsCore::ProcessField::Memory:
                return QString::number(this->memoryUtilization__, 'f', 1) + " %\n\nMemory";
            case StatsCore::ProcessField::Disk:
                return QString("Disk");
            case StatsCore::ProcessField::Network:
                return QString("Network");
            default:
                return QVariant();
            }
        }
        else if (role == Qt::TextAlignmentRole)
        {
            if(section == 0)
                return static_cast<int>(Qt::AlignBottom) | static_cast<int>(Qt::AlignLeft);
            else if(section == 1)
                return static_cast<int>(Qt::AlignBottom) | static_cast<int>(Qt::AlignHCenter);
            else
                return static_cast<int>(Qt::AlignBottom) | static_cast<int>(Qt::AlignRight);
        }
    }
    return QVariant();
}

ProcessProxyModel::~ProcessProxyModel()
{

}
