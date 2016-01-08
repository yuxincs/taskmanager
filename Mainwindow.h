#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include "stable.h"
#include "ProcessTableModel.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT
private:
    QTimer refreshTimer;
    ProcessTableModel processModel;
public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private:
    Ui::MainWindow *ui;
};

#endif // MAINWINDOW_H
