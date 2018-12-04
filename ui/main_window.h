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
    QPoint origin;
    bool isDragging;

    StatsCore *core;
    void setupUsagePlots();
    void setupStaticInformation();
private slots:
    void updateUsageOptionIcon();
    void refresh();
public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    static const int REFRESH_RATE;
    void updateWidget(const QVariantList & property);
private:
    Ui::MainWindow *ui;
};
