#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include "stable.h"
#include "ProcessTableModel.h"
#include "PerformanceModel.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT
private:
    QTimer refreshTimer;
    ProcessTableModel processModel;
    PerformanceModel performanceModel;
public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private:
    Ui::MainWindow *ui;
};

#endif // MAINWINDOW_H
