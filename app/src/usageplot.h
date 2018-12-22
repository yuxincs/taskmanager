#pragma once
#include "qcustomplot.h"

class UsagePlot : public QCustomPlot
{
    Q_OBJECT
private:
    enum Position { TopLeft, TopRight, BottomLeft, BottomRight };
    bool isReplotBlocked;
    QVector<double> time, usage;
    QList<QLabel *> cornorLabel;
    unsigned int maxTime;
    double maxUsage;
    QString unit;
protected:
    virtual void resizeEvent(QResizeEvent *event);
public:
    UsagePlot(QWidget *parent = nullptr);
    void setMaximumTime(unsigned int max);
    void setPlotName(const QString &name);
    void setMaximumUsage(double max);
    void setThemeColor(const QColor &themeColor, unsigned int scale = 1);
    void setUsageUnit(const QString &unit);
    void setLabelFont(const QFont &font);
    void addData(double data);
    QPixmap toPixmap(int width = 0, int height = 0, double scale = 1.0);
    void replot();
};
