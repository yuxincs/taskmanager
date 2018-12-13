#include "stable.h"
#include "usageplot.h"

void UsagePlot::resizeEvent(QResizeEvent *event)
{
    QCustomPlot::resizeEvent(event);
    const int DEFAULT_MINIMUM_MARGIN = 5;
    cornorLabel[TopLeft]->move(DEFAULT_MINIMUM_MARGIN, 0);
    cornorLabel[TopRight]->move(event->size().width() - cornorLabel[TopRight]->width() - DEFAULT_MINIMUM_MARGIN, 0);
    cornorLabel[BottomLeft]->move(DEFAULT_MINIMUM_MARGIN, event->size().height() - cornorLabel[BottomLeft]->height());
    cornorLabel[BottomRight]->move(event->size().width() - cornorLabel[TopRight]->width() - DEFAULT_MINIMUM_MARGIN, event->size().height() - cornorLabel[BottomLeft]->height());
}

UsagePlot::UsagePlot(QWidget *parent)
    :QCustomPlot(parent), time(60), usage(60)
{
    isReplotBlocked = false;

    // set minimum margins
    axisRect()->setMinimumMargins(QMargins(0, 22, 0, 22));

    // create four cornor labels
    for (int i = 0; i < 4; i++)
    {
        QLabel * label = new QLabel(this);
        label->show();
        label->setFixedWidth(100);
        label->setFixedHeight(20);
        label->setStyleSheet("color:rgba(0,0,0, 150);\
                             font: 75 10pt \"Arial\";");
        cornorLabel.append(label);
    }
    cornorLabel[BottomRight]->setText("0");
    // set correct alignment for each cornor label
    cornorLabel[BottomRight]->setAlignment(Qt::AlignRight);
    cornorLabel[TopRight]->setAlignment(Qt::AlignRight);
    cornorLabel[TopLeft]->setAlignment(Qt::AlignLeft);
    cornorLabel[BottomLeft]->setAlignment(Qt::AlignLeft);

    // enable second axises
    xAxis2->setVisible(true);
    yAxis2->setVisible(true);


    // disable axises' labels
    xAxis->setTickLabels(false);
    xAxis2->setTickLabels(false);
    yAxis->setTickLabels(false);
    yAxis2->setTickLabels(false);

    // reverse x axis
    xAxis->setRangeReversed(true);

    // disable all ticks and sub-ticks
    xAxis->setTickPen(QPen(QColor(255, 255, 255, 0)));
    xAxis->setSubTickPen(QPen(QColor(255, 255, 255, 0)));
    xAxis2->setTickPen(QPen(QColor(255, 255, 255, 0)));
    xAxis2->setSubTickPen(QPen(QColor(255, 255, 255, 0)));
    yAxis->setTickPen(QPen(QColor(255, 255, 255, 0)));
    yAxis->setSubTickPen(QPen(QColor(255, 255, 255, 0)));
    yAxis2->setTickPen(QPen(QColor(255, 255, 255, 0)));
    yAxis2->setSubTickPen(QPen(QColor(255, 255, 255, 0)));

    // set label font
    xAxis->setLabelFont(QFont("Arial"));
    xAxis->setLabelColor(QColor(255, 255, 255, 150));

    addGraph();
    graph(0)->addData(time, usage);
}


void UsagePlot::setMaximumTime(unsigned int max)
{
    // set time vector
    time.clear();
    for (unsigned int i = 0; i <= max; i++)
        time.append(i);

    // resize usage vector
    usage.resize(static_cast<int>(max + 1));

    // set axis range
    xAxis->setRange(0, max);
    xAxis2->setRange(0, max);

    // set time axis labels
    cornorLabel[BottomLeft]->setText(QString("%1 Sec").arg(max));
}

void UsagePlot::setPlotName(const QString & name)
{
    cornorLabel[TopLeft]->setText(name);
}

void UsagePlot::setMaximumUsage(double max)
{
    // set axis range
    yAxis->setRange(0, max);
    yAxis2->setRange(0, max);
}

void UsagePlot::setThemeColor(const QColor &themeColor, unsigned int scale)
{
    QColor color = themeColor;

    // set axises' colors
    color.setAlpha(50);
    xAxis->grid()->setPen(QPen(color, 1 * scale));
    yAxis->grid()->setPen(QPen(color, 1 * scale));
    color.setAlpha(255);
    xAxis->setBasePen(QPen(color, 2 * scale));
    xAxis2->setBasePen(QPen(color, 2 * scale));
    yAxis->setBasePen(QPen(color, 2 * scale));
    yAxis2->setBasePen(QPen(color, 2 * scale));

    // set line color
    color.setAlpha(220);
    graph(0)->setPen(QPen(color, 1 * scale));
    color.setAlpha(30);
    graph(0)->setBrush(QBrush(color));

    replot();
}

void UsagePlot::setUsageUnit(const QString &unit)
{
    cornorLabel[TopRight]->setText(QString("%1 %2").arg(yAxis2->range().upper).arg(unit));
}

void UsagePlot::setLabelFont(const QFont &font)
{
    for (QLabel * label : cornorLabel)
        label->setFont(font);
}

void UsagePlot::addData(double data)
{
    usage.removeLast();
    usage.prepend(data);
    graph(0)->setData(time, usage);
    replot();
}

QPixmap UsagePlot::toPixmap(int width, int height, double scale)
{
    // block replotting to prevent flashing
    isReplotBlocked = true;

    // disable grid line
    xAxis->grid()->setVisible(false);
    yAxis->grid()->setVisible(false);

    // backup themecolor
    QColor color = xAxis->basePen().color();
    // make everything bolder and covert
    setThemeColor(color, 4);

    QPixmap pixmap = QCustomPlot::toPixmap(width, height, scale);

    // reset style
    setThemeColor(color);
    // enable grid line
    xAxis->grid()->setVisible(true);
    yAxis->grid()->setVisible(true);

    isReplotBlocked = false;
    return pixmap;
}

void UsagePlot::replot()
{
    if(isReplotBlocked)
        return;
    else
        QCustomPlot::replot();
}
