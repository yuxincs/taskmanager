#include "ProcessTableModel.h"

// initialize static members
unsigned long ProcessTableModel::lastCpuTime = -1;
unsigned long ProcessTableModel::curCpuTime = -1;


ProcessTableModel::ProcessTableModel(QObject *parent)
    :QAbstractTableModel(parent)
{
    sortColumn = -1;
    sortOrder = Qt::AscendingOrder;

    // set maximum property
    maxProperty << 0 << 0 << 100 << 1024 * 128 << 50 << 1;

    refresh();
    // refresh again after 100 ms to calculate cpu usage
    QTimer::singleShot(100, this, &ProcessTableModel::refresh);
}


void ProcessTableModel::refresh()
{
    emit layoutAboutToBeChanged();

    // read current total cpu time
    QFile stat("/proc/stat");
    stat.open(QIODevice::ReadOnly);
    QStringList statContent = QString(stat.readLine()).split(" ");
    curCpuTime = 0;
    for(int i = 1;i < statContent.size(); i ++)
    {
        const QString & item = statContent.at(i);
        curCpuTime += item.toULong();
    }

    // iterate through /proc directory to find new process
    for(const QString & entry : QDir("/proc").entryList(QDir::NoDotAndDotDot | QDir::Dirs))
    {
        bool isProc = false;
        int pid = entry.toInt(&isProc);

        // if it is a new process
        if(isProc && !pidSet.contains(pid))
        {
            processList.append(new Process(pid, this));
            pidSet.insert(pid);
        }
    }

    QList<Process *> toDelete;
    // iterate through current process list to refresh info
    // and remove those have already been killed
    for(Process * process : processList)
    {
        // if process doesn't exist anymore
        // queue for deletion
        if(!process->refresh())
            toDelete.append(process);
    }
    // execute deletion
    for(Process * process : toDelete)
    {
        pidSet.remove(process->property(Process::ID).toUInt());
        processList.removeOne(process);
        delete process;
    }

    // refresh cpu time
    lastCpuTime = curCpuTime;

    sortByColumn(sortColumn, sortOrder);
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
        return Process::PropertyCount;
}

ProcessTableModel::~ProcessTableModel()
{
    for(Process * process: processList)
        delete process;
}

QVariant ProcessTableModel::headerData(int section, Qt::Orientation orientation, int role) const
{
    if(orientation == Qt::Horizontal)
    {
        if (role == Qt::DisplayRole)
        {
            switch(section)
            {
            case Process::ProcessName:
                return QString("Process Name");
            case Process::ID:
                return QString("PID");
            case Process::CPUUsage:
                return QString("CPU");
            case Process::MemoryUsage:
                return QString("Memory");
            case Process::DiskUsage:
                return QString("Disk");
            case Process::NetworkUsage:
                return QString("Network");
            default:
                return QVariant();
            }
        }
        else if (role == Qt::TextAlignmentRole)
        {
            if(section == 0)
                return (int)Qt::AlignBottom | (int)Qt::AlignLeft;
            else if(section == 1)
                return (int)Qt::AlignBottom | (int)Qt::AlignHCenter;
            else
                return (int)Qt::AlignBottom | (int)Qt::AlignRight;
        }
    }
    return QVariant();
}

QVariant ProcessTableModel::data(const QModelIndex & index, int role) const
{
    if(!index.isValid())
        return QVariant();

    Process * process = processList[index.row()];
    if(role == Qt::DisplayRole)
    {
        switch(index.column())
        {
        case Process::ProcessName:
            return process->property(Process::ProcessName);
        case Process::ID:
            return process->property(Process::ID);
        case Process::CPUUsage:
        {
            float cpuUsage = process->property(Process::CPUUsage).toFloat();
            if(cpuUsage == 0)
                return "0 %";
            else
                return QString::number(cpuUsage, 'f', 1) + " %";
        }
        case Process::MemoryUsage:
        {
            unsigned int memory = process->property(Process::MemoryUsage).toUInt();
            if(memory < 1024)
                return QString::number(memory) + " KB";
            else if(memory < 1024 * 1024)
                return QString::number(memory / 1024, 'f', 1) + " MB";
            else
                return QString::number(memory / (1024 * 1024), 'f', 1) + " GB";
        }
        case Process::DiskUsage:
        {
            unsigned int diskIO = process->property(Process::DiskUsage).toUInt();
            if(diskIO == 0)
                return "0 MB/Sec";
            else if(diskIO < 1024 * 100)
                return "0.1 MB/Sec";
            else
                return QString::number(diskIO / (float)(1024 * 1024), 'f', 1) + " MB/Sec";
        }
        case Process::NetworkUsage:
            return process->property(Process::NetworkUsage).toString() + " Mbps";
        default:
            return QString("None");
        }
    }
    else if (role == Qt::BackgroundRole)
    {
        if(index.column() > 1)
        {
            int level =  process->property(index.column()).toFloat() / (maxProperty.at(index.column()) / 5);
            level = level > 4 ? 4 : level;
            return QBrush(QColor(255, 198, 61, 80 + 100 * ((float)level / 4)));
        }

        return QVariant();
    }
    else if (role == Qt::TextAlignmentRole)
    {
        switch(index.column())
        {
        case Process::ProcessName:
            return (int)Qt::AlignLeft | (int)Qt::AlignVCenter;
        case Process::ID:
            return (int)Qt::AlignHCenter | (int)Qt::AlignVCenter;
        default:
            return (int)Qt::AlignRight | (int)Qt::AlignVCenter;
        }
    }
    return QVariant();
}

void ProcessTableModel::sortByColumn(int column, Qt::SortOrder order)
{
    if(column < 0 || column >= Process::PropertyCount)
        return;

    sortColumn = column;
    sortOrder = order;
    sort(column, order);
}

void ProcessTableModel::sort(int column, Qt::SortOrder order)
{
    emit layoutAboutToBeChanged();

    if(order == Qt::AscendingOrder)
        std::sort(processList.begin(),processList.end(),
              [=](Process * left, Process * right)
        {
            // If sorted by process name
            if(column == Process::ProcessName)
                return left->property(Process::ProcessName).toString().compare(right->property(Process::ProcessName).toString(), Qt::CaseInsensitive) < 0;
            else
                return left->property(column).toFloat() < right->property(column).toFloat();
        });
    else
        std::sort(processList.begin(),processList.end(),
              [=](Process * left, Process * right)
        {
            // If sorted by process name
            if(column == 0)
                return left->property(Process::ProcessName).toString().compare(right->property(Process::ProcessName).toString(), Qt::CaseInsensitive) > 0;
            else
                return left->property(column).toFloat() > right->property(column).toFloat();
        });

    emit layoutChanged();
}

void ProcessTableModel::killProcess(unsigned int pid)
{
    QString cmd = QString("kill -s 9 %1").arg(pid);
    system(cmd.toLatin1().data());
}

unsigned long ProcessTableModel::lastTotalCpuTime()
{
    return lastCpuTime;
}

unsigned long ProcessTableModel::curTotalCpuTime()
{
    return curCpuTime;
}
