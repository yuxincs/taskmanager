#include "processproxymodel.h"
#include "statscore.h"

ProcessProxyModel::ProcessProxyModel(QObject *parent)
    : QIdentityProxyModel(parent)
{

}

QVariant ProcessProxyModel::data(const QModelIndex &index, int role) const
{
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
                    return QString("CPU");
                case StatsCore::ProcessField::Memory:
                    return QString("Memory");
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
