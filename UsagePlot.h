#ifndef USAGEPLOT_H
#define USAGEPLOT_H
#include "stable.h"

class UsagePlot : public QCustomPlot
{
	Q_OBJECT
private:
	enum Position
	{
		TopLeft, TopRight, BottomLeft, BottomRight
	};
	QVector<double> time, usage;
	QList<QLabel *> cornorLabel;
protected:
	virtual void resizeEvent(QResizeEvent *event);
public:
	UsagePlot(QWidget * parent = nullptr);
	void setMaximumTime(unsigned int max);
	void setPlotName(const QString & name);
	void setMaximumUsage(double max);
	void setThemeColor(const QColor & themeColor);
	void setUsageUnit(const QString & unit);
	void setLabelFont(const QFont & font);
	void addData(double data);
};

#endif // USAGEPLOT_H
