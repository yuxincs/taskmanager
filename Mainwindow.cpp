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

    ui->processView->setModel(&processModel);
    ui->processView->setSelectionBehavior(QAbstractItemView::SelectRows);
    ui->processView->setSelectionMode(QAbstractItemView::SingleSelection);
    ui->processView->setColumnWidth(0,200);
    ui->processView->setColumnWidth(1,60);
    ui->processView->setColumnWidth(2,60);
    ui->processView->setColumnWidth(3,100);
    ui->processView->setColumnWidth(4,90);
    ui->processView->setColumnWidth(5,80);
    ui->processView->setSortingEnabled(true);

    // connect the sorting signals / slots
    connect(ui->processView->header(), &QHeaderView::sortIndicatorChanged,
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
        QModelIndex curIndex = ui->processView->currentIndex();
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

