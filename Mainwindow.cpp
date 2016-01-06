#include "Mainwindow.h"
#include "ui_Mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    QFile file("/proc/cpuinfo");
    if(file.open(QIODevice::ReadOnly))
        qDebug() << file.readAll();
}

MainWindow::~MainWindow()
{
    delete ui;
}
