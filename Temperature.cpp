#include "Temperature.h"

Temperature::Temperature(const QString & label, float temperature)
{
    name = label;
    temp = temperature;
}

const QString & Temperature::label() const
{
    return name;
}

float Temperature::value() const
{
    return temp;
}

void Temperature::setValue(float value)
{
    temp = value;
}
