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

    // setup process tab
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

    setupStaticInformation();

    // setup data widget mapping
    connect(&performanceModel, &PerformanceModel::updateWidget,
            this, &MainWindow::updateWidget);

    // setup performance tab
    setupUsagePlots();
    ui->usageOptionList->setIconSize(QSize(60,50));

    // connect the sorting signals / slots
    connect(ui->processView->header(), &QHeaderView::sortIndicatorChanged,
            &processModel, &ProcessTableModel::sortByColumn);

    // connect list widget's signals to stack widget
    connect(ui->usageOptionList, &QListWidget::currentRowChanged,
            ui->stackedWidget, &QStackedWidget::setCurrentIndex);

    connect(&performanceModel, &PerformanceModel::sendSharedData,
            &processModel, &ProcessTableModel::updateSharedData);

    // connect refresh timers
    connect(&refreshTimer, &QTimer::timeout,
            this, &MainWindow::refresh);

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

    refresh();

    // refresh again after 100 ms to get sampling data ready
    QTimer::singleShot(100, this, &MainWindow::refresh);

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
    cpuPixmap = cpuPixmap.copy(0, 18, cpuPixmap.width(), cpuPixmap.height() - 36);
    ui->usageOptionList->item(0)->setIcon(QIcon(cpuPixmap));
    QPixmap memoryPixmap = ui->memoryUsagePlot->toPixmap();
    memoryPixmap = memoryPixmap.copy(0, 18, memoryPixmap.width(), memoryPixmap.height() - 36);
    ui->usageOptionList->item(1)->setIcon(QIcon(memoryPixmap));
}

void MainWindow::refresh()
{
    performanceModel.refresh();

    // refresh other models using global resource model
    processModel.refresh();
}

void MainWindow::updateWidget(const QVariantList & property)
{
    ui->utilization->setText(property[PerformanceModel::CpuUtilization].toString() + " %");
    ui->availableMemory->setText(QString::number(property[PerformanceModel::MemoryAvailable].toFloat(), 'f', 1) + " GB");
    ui->usedMemory->setText(QString::number(property[PerformanceModel::MemoryUsed].toFloat(), 'f', 1) + " GB");
    ui->speed->setText(property[PerformanceModel::CpuSpeed].toString() + " GHz");
    ui->processes->setText(property[PerformanceModel::Processes].toString());
    ui->threads->setText(property[PerformanceModel::Threads].toString());
    ui->upTime->setText(property[PerformanceModel::CpuUpTime].toString());

    ui->cpuUsagePLot->addData(property[PerformanceModel::CpuUtilization].toDouble());
    ui->memoryUsagePlot->addData(property[PerformanceModel::MemoryUsed].toDouble());
}

void MainWindow::setupStaticInformation()
{
}
