#include "processproxymodel.h"
#include "statscore.h"

ProcessProxyModel::ProcessProxyModel(quint64 totalMemory, QObject *parent)
    : QIdentityProxyModel(parent)
{
    this->cpuUtilization__ = 0;
    this->memoryUtilization__ = 0;
    this->totalMemory__ = totalMemory;
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
            quint64 memory = unmodifiedData.toULongLong();
            if(memory < 1024 * 1024)
                return QString("%1 KB").arg(QString::number(memory / 1024.0, 'f', 1));
            else if(memory < 1024 * 1024 * 1024)
                return QString("%1 MB").arg(QString::number(memory / (1024.0 * 1024.0), 'f', 1));
            else
                return QString("%1 GB").arg(QString::number(memory / (1024.0 * 1024.0 * 1024.0), 'f', 1));
        }
        case StatsCore::Disk:
            return QString("%1 MB/s").arg(unmodifiedData.toULongLong());
        case StatsCore::Network:
            return QString("%1 Mbps").arg(unmodifiedData.toULongLong());
        }
    }
    else if (role == Qt::BackgroundRole)
    {
        QVariant displayData = QIdentityProxyModel::data(index, Qt::DisplayRole);
        if(index.column() > 1)
        {
            double level = 0;
            if(index.column() == StatsCore::ProcessField::CPU) // CPU Utilization, data ranges from 0 - 100
            {
                level = displayData.toDouble() * 4.0 / 100;
            }
            else if(index.column() == StatsCore::ProcessField::Memory) // memory usage, data ranges from 0 - TotalMemory
            {
                //qDebug() << displayData << this->totalMemory__ << (displayData.toDouble() / this->totalMemory__);
                level = (displayData.toDouble() * 10 / this->totalMemory__);
            }
            level = level <= 1.0 ? level : 1.0;
            //qDebug() << level;
            //if(level > 0.25)
                //qDebug() << static_cast<int>(80 + 100 * level) << level << displayData << this->totalMemory__;
            return QBrush(QColor(255, 198, 61, static_cast<int>(80 + 100 * level)));
        }
        // fall through, return the default unmodified data
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
