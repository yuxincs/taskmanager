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
}

ProcessProxyModel::~ProcessProxyModel()
{

}
