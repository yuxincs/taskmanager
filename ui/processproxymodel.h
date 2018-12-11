#pragma once
#include "stable.h"

class ProcessProxyModel : public QIdentityProxyModel
{
public:
    ProcessProxyModel(QObject *parent = nullptr);
    virtual ~ProcessProxyModel();

protected:
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const;
};
