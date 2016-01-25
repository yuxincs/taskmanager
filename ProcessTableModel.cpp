#include "ProcessTableModel.h"

ProcessTableModel::ProcessTableModel(QObject *parent)
    :QAbstractTableModel(parent)
{
    for(const QString entry : QDir("/proc").entryList(QDir::NoDotAndDotDot | QDir::Dirs))
    {
        bool isProc = false;
        int uid = entry.toInt(&isProc);
        if(isProc)
            processList.append(new Process(uid, this));
    }
}

void ProcessTableModel::refresh()
{
    emit layoutAboutToBeChanged();
    for(Process * process: processList)
    {
        // If process doesn't exist anymore
        if(!process->refresh())
        {
            processList.removeOne(process);
            delete process;
        }
    }
    emit layoutChanged();
}

int ProcessTableModel::rowCount(const QModelIndex & parent) const
{
    if(parent.isValid())
        return 0;
    else
        return processList.size();
}

int ProcessTableModel::columnCount(const QModelIndex & parent) const
{
    if(parent.isValid())
        return 0;
    else
        return 6;
}

ProcessTableModel::~ProcessTableModel()
{
    for(Process * process: processList)
        delete process;
}

QVariant ProcessTableModel::headerData(int section, Qt::Orientation orientation, int role) const
{
    if(role != Qt::DisplayRole || orientation != Qt::Horizontal)
        return QVariant();

    switch(section)
    {
    case 0:
        return QString("Name");
    case 1:
        return QString("Unique ID");
    case 2:
        return QString("% CPU");
    case 3:
        return QString("Memory");
    case 4:
        return QString("Disk");
    case 5:
        return QString("Network");
    default:
        return QVariant();
    }
}

QVariant ProcessTableModel::data(const QModelIndex & index, int role) const
{
    if(!index.isValid())
        return QVariant();

    if(role == Qt::DisplayRole)
    {
        switch(index.column())
        {
        case 0:
            return processList[index.row()]->name();
        case 1:
            return processList[index.row()]->uid();
        case 2:
            return processList[index.row()]->cpuUsage();
        case 3:
            return QString::number(processList[index.row()]->memoryUsage(),'f',1) + " MB";
        case 4:
            return processList[index.row()]->diskUsage();
        case 5:
            return processList[index.row()]->networkUsage();
        default:
            return QString("None");
        }
    }
    else if (role == Qt::DecorationRole)
    {

    }
    return QVariant();
}

void ProcessTableModel::sortByColumn(int column, Qt::SortOrder order)
{
    sort(column, order);
}

void ProcessTableModel::sort(int column, Qt::SortOrder order)
{
    if(order == Qt::AscendingOrder)
        std::sort(processList.begin(),processList.end(),
              [=](Process * left, Process * right)
        {
            // If sorted by process name
            if(column == 0)
                return left->name().compare(right->name(), Qt::CaseInsensitive) < 0;
            else
                return left->property()[column].toFloat() < right->property()[column].toFloat();
        });
    else
        std::sort(processList.begin(),processList.end(),
              [=](Process * left, Process * right)
        {
            // If sorted by process name
            if(column == 0)
                return left->name().compare(right->name(), Qt::CaseInsensitive) > 0;
            else
                return left->property()[column].toFloat() > right->property()[column].toFloat();
        });

    dataChanged(QModelIndex(), QModelIndex());
}
