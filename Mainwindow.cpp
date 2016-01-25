#include "Mainwindow.h"
#include "ui_Mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    ui->processesView->setModel(&processModel);
    ui->processesView->setSelectionBehavior(QAbstractItemView::SelectRows);
    ui->processesView->horizontalHeader()->setStretchLastSection(true);

    // Connect the sorting signals / slots
    connect(ui->processesView->horizontalHeader(), &QHeaderView::sortIndicatorChanged,
            &processModel, &ProcessTableModel::sortByColumn);

    // Bind the refresh signals and slots
    connect(&refreshTimer, &QTimer::timeout,
            &processModel, &ProcessTableModel::refresh);

    connect(&refreshTimer, &QTimer::timeout,
            &systemModel, &PerformanceModel::refresh);

    // Refresh every 200 ms
    refreshTimer.start(200);
}

MainWindow::~MainWindow()
{
    delete ui;
}

