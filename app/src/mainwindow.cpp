#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "processproxymodel.h"


MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    // setup StatsCore
    this->core = StatsCore::createCore(1000);

    // setup local variables
    this->curSelectedPID = 0;

    setWindowIcon(QIcon(":/icon.png"));

    ui->setupUi(this);

    // setup process table
    QAbstractItemModel *model = core->processModel();
    // setup a proxy model to add color and other UI-related elements to it
    ProcessProxyModel *proxyModel = new ProcessProxyModel(model);
    proxyModel->setSourceModel(model);
    ui->processView->setModel(proxyModel);
    ui->processView->setSelectionBehavior(QTableView::SelectRows);
    ui->processView->setSelectionMode(QTableView::SingleSelection);
    ui->processView->setColumnWidth(0,190);
    ui->processView->setColumnWidth(1,60);
    ui->processView->setColumnWidth(2,60);
    ui->processView->setColumnWidth(3,100);
    ui->processView->setColumnWidth(4,90);
    ui->processView->setColumnWidth(5,80);
    ui->processView->setSortingEnabled(true);
    ui->processView->setEditTriggers(QTableView::NoEditTriggers);

    // setup performance tab
    // setup cpu usage plot
    ui->cpuUsagePLot->setPlotName("% Utilization");
    ui->cpuUsagePLot->setMaximumTime(60);
    ui->cpuUsagePLot->setMaximumUsage(100);
    ui->cpuUsagePLot->setUsageUnit("%");
    ui->cpuUsagePLot->setThemeColor(QColor(17, 125, 187));

    // setup memory usage plot
    ui->memoryUsagePlot->setPlotName("Memory Usage");
    ui->memoryUsagePlot->setMaximumTime(60);
    ui->memoryUsagePlot->setThemeColor(QColor(139,18,174));

    updateUsageOptionIcon();

    // setup other widgets
    connect(ui->killProcessButton, &QPushButton::clicked,
            [=]{
        QModelIndex curIndex = ui->processView->currentIndex();
        if(curIndex.isValid())
        {
            unsigned int pid = curIndex.sibling(curIndex.row(), 1).data().toUInt();
            this->core->killProcess(pid);
        }
    });

    connect(model, &QSqlTableModel::modelAboutToBeReset, this, [=] {
        // store the current selected PID
        QModelIndex index = ui->processView->selectionModel()->currentIndex();
        if (index.isValid())
            this->curSelectedPID = index.sibling(index.row(), 1).data().toULongLong();
    });

    connect(model, &QSqlTableModel::modelReset, this, [=] {
        // restore the current selected PID
        if(this->curSelectedPID != 0)
        {
            int current = 0;
            while(ui->processView->model()->canFetchMore(QModelIndex()))
            {
                // the first fetch has been done by library
                if(current != 0)
                    ui->processView->model()->fetchMore(QModelIndex());

                int rowCount = ui->processView->model()->rowCount();
                for (; current < rowCount; current ++)
                {
                    const QModelIndex &index = ui->processView->model()->index(current, 1);
                    if(index.data().toULongLong() == this->curSelectedPID)
                    {
                        ui->processView->selectionModel()->setCurrentIndex(index,
                                                                           QItemSelectionModel::Rows | QItemSelectionModel::ClearAndSelect);
                        return;
                    }
                }
            };
            // if cannot find the current PID (which means it has been removed)
            this->curSelectedPID = 0;
        }
    });

    // connect list widget's signals to stack widget
    ui->usageOptionList->setIconSize(QSize(60,50));
    connect(ui->usageOptionList, &QListWidget::currentRowChanged, ui->stackedWidget, &QStackedWidget::setCurrentIndex);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::updateUsageOptionIcon()
{
    QPixmap cpuPixmap = ui->cpuUsagePLot->toPixmap();
    cpuPixmap = cpuPixmap.copy(0, 18, cpuPixmap.width(), cpuPixmap.height() - 36);
    ui->usageOptionList->item(0)->setIcon(QIcon(cpuPixmap));
    QPixmap memoryPixmap = ui->memoryUsagePlot->toPixmap();
    memoryPixmap = memoryPixmap.copy(0, 18, memoryPixmap.width(), memoryPixmap.height() - 36);
    ui->usageOptionList->item(1)->setIcon(QIcon(memoryPixmap));
}
