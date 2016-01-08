#include "ProcessTableModel.h"

ProcessTableModel::ProcessTableModel(QObject *parent)
    :QAbstractTableModel(parent)
{
    for(const QString entry : QDir("/proc").entryList(QDir::NoDotAndDotDot | QDir::Dirs))
    {
        bool isProc = false;
        entry.toInt(&isProc);
        if(isProc)
            processList.append(new Process(QDir(entry), this));
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
        return QString("Process Name");
    case 1:
        return QString("Unique ID");
    case 2:
        return QString("CPU Usage");
    case 3:
        return QString("Memory Usage");
    case 4:
        return QString("Disk Usage");
    case 5:
        return QString("Network Usage");
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
            return processList[index.row()]->uniqueID();
        case 2:
            return processList[index.row()]->cpuOccupancy();
        case 3:
            return QString::number(processList[index.row()]->memoryOccupancy(),'f',1) + " MB";
        case 4:
            return processList[index.row()]->diskOccupancy();
        case 5:
            return processList[index.row()]->networkOccupancy();
        default:
            return QString("None");
        }
    }
    else if (role == Qt::DecorationRole)
    {

    }
    return QVariant();
}


