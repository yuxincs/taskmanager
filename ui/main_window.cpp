#include "main_window.h"
#include "ui_main_window.h"


MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    // setup StatsCore based on the OS-specific implementations
    #if defined(unix) || defined(__unix__) || defined(__unix)
    this->core = new StatsCore(1000);
    #elif defined (__APPLE__)
    this->core = new StatsCore(1000);
    #endif

    setWindowIcon(QIcon(":/icon.png"));

    ui->setupUi(this);

    // setup process table
    QSqlTableModel *model = core->processModel();
    model->select();
    model->setHeaderData(0, Qt::Horizontal, "Name");
    model->setHeaderData(1, Qt::Horizontal, "PID");
    model->setHeaderData(2, Qt::Horizontal, "CPU");
    model->setHeaderData(3, Qt::Horizontal, "Memory");
    model->setHeaderData(4, Qt::Horizontal, "Disk");
    model->setHeaderData(5, Qt::Horizontal, "Network");
    ui->processView->setModel(model);
    ui->processView->setSelectionBehavior(QTableView::SelectRows);
    ui->processView->setSelectionMode(QTableView::SingleSelection);
    ui->processView->setColumnWidth(0,200);
    ui->processView->setColumnWidth(1,60);
    ui->processView->setColumnWidth(2,60);
    ui->processView->setColumnWidth(3,100);
    ui->processView->setColumnWidth(4,90);
    ui->processView->setColumnWidth(5,80);
    ui->processView->setSortingEnabled(true);
    ui->processView->setEditTriggers(QTableView::NoEditTriggers);

    // setup performance tab
    setupUsagePlots();

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

    connect(model, &QSqlTableModel::rowsAboutToBeInserted, [=] {
        QModelIndexList list = ui->processView->selectionModel()->selectedRows();
        qDebug() << "layout changed" << list.count();
    });

    /*
    setupStaticInformation();

    // setup process tab
    ui->processView->setModel(&processModel);


    // setup data widget mapping
    connect(&performanceModel, &PerformanceModel::updateWidget,
            this, &MainWindow::updateWidget);

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

    refresh();

    // refresh again after 100 ms to get sampling data ready
    QTimer::singleShot(100, this, &MainWindow::refresh);

    // set refresh rate
    refreshTimer.start(REFRESH_RATE);
*/
}

MainWindow::~MainWindow()
{
    delete ui;
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
    /*
    performanceModel.refresh();

    // refresh other models using global resource model
    processModel.refresh();
    */
}

void MainWindow::updateWidget(const QVariantList & property)
{
    /*
    ui->utilization->setText(QString::number(property[PerformanceModel::CpuUtilization].toUInt()) + " %");

    float cpuSpeed = property[PerformanceModel::CpuSpeed].toFloat();
    if(cpuSpeed < 1024)
        ui->speed->setText(QString::number(cpuSpeed, 'f', 1) + " MHz");
    else
        ui->speed->setText(QString::number(cpuSpeed / 1024, 'f', 1) + " GHz");

    ui->processes->setText(property[PerformanceModel::Processes].toString());
    ui->upTime->setText(property[PerformanceModel::CpuUpTime].toString());

    ui->cpuUsagePLot->addData(property[PerformanceModel::CpuUtilization].toDouble());

    double memoryUsed = property[PerformanceModel::MemoryTotal].toDouble() - property[PerformanceModel::MemoryAvailable].toDouble();
    memoryUsed /= 1024 * 1024;
    ui->memoryUsagePlot->addData(memoryUsed);
    memoryUsed = qRound(memoryUsed * 10) / 10.0;
    ui->usedMemory->setText(QString("%1 GB").arg(memoryUsed));

    double memoryAvailable = property[PerformanceModel::MemoryAvailable].toUInt();
    memoryAvailable /= 1024 * 1024;
    memoryAvailable = qRound(memoryAvailable * 10) / 10.0;
    ui->availableMemory->setText(QString("%1 GB").arg(memoryAvailable));

    double memoryCached = property[PerformanceModel::MemoryCached].toUInt();
    memoryCached /= 1024 * 1024;
    memoryCached = qRound(memoryCached * 10) / 10.0;
    ui->cached->setText(QString("%1 GB").arg(memoryCached));
    ui->temperature->setText(QString("%1 ℃").arg(property[PerformanceModel::CpuTemperature].toFloat()));
    */
}

void MainWindow::setupStaticInformation()
{
    /*
    QFile cpuinfo("/proc/cpuinfo");
    QRegularExpression rx;
    if(cpuinfo.open(QIODevice::ReadOnly))
    {
        QString content(cpuinfo.readAll());
        rx.setPattern("model name    : (.*)\n");
        QStringList modelName = rx.match(content).captured(1).split(" @ ");
        ui->cpuName->setText(modelName.at(0));
        ui->maxSpeed->setText(modelName.at(1));

        rx.setPattern("cpu cores    : (.*)\n");
        ui->cores->setText(rx.match(content).captured(1));

        rx.setPattern("siblings    : (.*)\n");
        ui->logicalProcessors->setText(rx.match(content).captured(1));
    }

    QFile meminfo("/proc/meminfo");
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemTotal:       (.*) kB\n");
        float memTotal = rx.match(content).captured(1).toUInt();

        memTotal /= 1024 * 1024;
        memTotal = qRound(memTotal * 10) / 10.0;
        ui->memoryName->setText(QString::number(memTotal) + " GB");
        ui->memoryUsagePlot->setMaximumUsage(memTotal);
        ui->memoryUsagePlot->setUsageUnit("GB");
    }
    */
}
