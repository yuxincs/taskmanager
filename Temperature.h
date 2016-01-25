#ifndef TEMPERATURE_H
#define TEMPERATURE_H
#include "stable.h"

class Temperature
{
private:
    QString name;
    float temp;
public:
    Temperature(const QString & label, float temperature);
    const QString & label() const;
    float value() const;
    void setValue(float value);
};

#endif // TEMPERATURE_H
