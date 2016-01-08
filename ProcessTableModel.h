#ifndef PROCESSTABLEMODEL_H
#define PROCESSTABLEMODEL_H
#include "stable.h"
#include "Process.h"

class ProcessTableModel : public QAbstractTableModel
{
    Q_OBJECT
private:
    QList<Process *> processList;
public:
    explicit ProcessTableModel(QObject * parent = nullptr);
    virtual ~ProcessTableModel();
protected:
    int rowCount(const QModelIndex & parent = QModelIndex()) const;
    int columnCount(const QModelIndex & parent) const;
    QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const;
public slots:
    void refresh();
};

#endif // PROCESSTABLEMODEL_H
