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
    setupUsagePlots();

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

    // connect list widget's signals to stack widget
    connect(ui->usageOptionList, &QListWidget::currentRowChanged,
            ui->stackedWidget, &QStackedWidget::setCurrentIndex);

    // connect refresh timers
    connect(&refreshTimer, &QTimer::timeout,
            &processModel, &ProcessTableModel::refresh);

    connect(&refreshTimer, &QTimer::timeout,
            &performanceModel, &PerformanceModel::refresh);

    connect(&refreshTimer, &QTimer::timeout,
            this, &MainWindow::updateUsageOptionIcon);

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

void MainWindow::setupUsagePlots()
{
    // setup cpu usage plot
    ui->cpuUsagePLot->setPlotName("% Utilization");
    ui->cpuUsagePLot->setMaximumTime(60);
    ui->cpuUsagePLot->setMaximumUsage(100);
    ui->cpuUsagePLot->setUsageUnit("%");
    ui->cpuUsagePLot->setThemeColor(QColor(17, 125, 187));

    // setup memory usage plot
    ui->memoryUsagePlot->setPlotName("Memory Usage");
    ui->memoryUsagePlot->setMaximumTime(60);
    ui->memoryUsagePlot->setMaximumUsage(12);
    ui->memoryUsagePlot->setUsageUnit("GB");
    ui->memoryUsagePlot->setThemeColor(QColor(139,18,174));

    updateUsageOptionIcon();
}

void MainWindow::updateUsageOptionIcon()
{
    QPixmap cpuPixmap = ui->cpuUsagePLot->toPixmap();
    cpuPixmap = cpuPixmap.copy(0, 22, cpuPixmap.width(), cpuPixmap.height() - 44);
    ui->usageOptionList->item(0)->setIcon(QIcon(cpuPixmap));
    ui->usageOptionList->item(1)->setIcon(QIcon(ui->memoryUsagePlot->toPixmap()));
}

