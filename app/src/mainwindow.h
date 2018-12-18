#pragma once
#include "stable.h"
#include "statscore.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT
private:
    StatsCore *core;
    quint64 curSelectedPID;
    void setupUsagePlots();
private slots:
    void updateUsageOptionIcon();
public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    void updateWidget(const QVariantList & property);
private:
    Ui::MainWindow *ui;
};
