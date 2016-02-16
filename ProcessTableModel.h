#ifndef PROCESSTABLEMODEL_H
#define PROCESSTABLEMODEL_H
#include "stable.h"
#include "Process.h"
#include "PerformanceModel.h"

class ProcessTableModel : public QAbstractTableModel
{
    Q_OBJECT
private:
    // shared data with PerformanceModel
    unsigned int cpuUtilization;
    unsigned int memoryUtilization;
    unsigned long totalCpuTimeDiff;

    QList<Process *> processList;
    QSet<unsigned int> pidSet;

    QList<float> maxProperty;
    int sortColumn;
    Qt::SortOrder sortOrder;

public:
    explicit ProcessTableModel(QObject * parent = nullptr);
    virtual ~ProcessTableModel();
    static unsigned long lastTotalCpuTime();
    static unsigned long curTotalCpuTime();
protected:
    int rowCount(const QModelIndex & parent = QModelIndex()) const;
    int columnCount(const QModelIndex & parent) const;
    QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const;
    void sort(int column, Qt::SortOrder order = Qt::AscendingOrder);
public slots:
    void refresh();
    void killProcess(unsigned int pid);
    void sortByColumn(int column, Qt::SortOrder order);
    void updateSharedData(unsigned int cpuUtilization, unsigned int memoryUtilization, unsigned long totalCpuTimeDiff);
};

#endif // PROCESSTABLEMODEL_H
