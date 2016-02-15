#include "Mainwindow.h"
#include "ui_Mainwindow.h"

// initialize static members
const int MainWindow::REFRESH_RATE = 1000;

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    setWindowFlags(Qt::FramelessWindowHint);
    isDragging = false;

    ui->setupUi(this);

    ui->processesView->setModel(&processModel);
    ui->processesView->setSelectionBehavior(QAbstractItemView::SelectRows);
    ui->processesView->setSelectionMode(QAbstractItemView::SingleSelection);
    ui->processesView->setColumnWidth(0,200);
    ui->processesView->setColumnWidth(1,60);
    ui->processesView->setColumnWidth(2,60);
    ui->processesView->setColumnWidth(3,100);
    ui->processesView->setColumnWidth(4,90);
    ui->processesView->setColumnWidth(5,80);
    ui->processesView->setSortingEnabled(true);

    // connect the sorting signals / slots
    connect(ui->processesView->header(), &QHeaderView::sortIndicatorChanged,
            &processModel, &ProcessTableModel::sortByColumn);

    // connect refresh timers
    connect(&refreshTimer, &QTimer::timeout,
            &processModel, &ProcessTableModel::refresh);

    connect(&refreshTimer, &QTimer::timeout,
            &performanceModel, &PerformanceModel::refresh);

    connect(ui->closeButton, &QPushButton::clicked,
            qApp, &QApplication::quit);

    connect(ui->minimizeButton, &QPushButton::clicked,
            this, &MainWindow::showMinimized);

    connect(ui->killProcessButton, &QPushButton::clicked,
            [=]{
        QModelIndex curIndex = ui->processesView->currentIndex();
        if(curIndex.isValid())
        {
            unsigned int pid = curIndex.sibling(curIndex.row(), 1).data().toUInt();
            processModel.killProcess(pid);
        }
    });

    // set refresh rate
    refreshTimer.start(REFRESH_RATE);
}

MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::mousePressEvent(QMouseEvent * event)
{
    if(ui->titleWidget->rect().contains(event->pos()))
    {
        isDragging = true;
        origin = event->pos();
    }
}

void MainWindow::mouseMoveEvent(QMouseEvent * event)
{
    if ((event->buttons() & Qt::LeftButton) && isDragging)
        move(event->globalX() - origin.x(), event->globalY() - origin.y());
}

void MainWindow::mouseReleaseEvent(QMouseEvent * event)
{
    isDragging = false;
}

