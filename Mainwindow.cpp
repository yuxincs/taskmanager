#include "Mainwindow.h"
#include "ui_Mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    ui->processesView->setModel(&processModel);

    // Refresh every 200 ms
    refreshTimer.start(200);
    connect(&refreshTimer, &QTimer::timeout,
            &processModel, &ProcessTableModel::refresh);
}

MainWindow::~MainWindow()
{
    delete ui;
}

