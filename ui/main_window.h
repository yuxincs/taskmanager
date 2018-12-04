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
    void setupUsagePlots();
    void setupStaticInformation();
private slots:
    void updateUsageOptionIcon();
    void refresh();
public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    void updateWidget(const QVariantList & property);
private:
    Ui::MainWindow *ui;
};
