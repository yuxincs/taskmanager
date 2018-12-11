TARGET = testcore
QT = testlib

CONFIG += testcase

SOURCES += testcore.cpp

LIBS += -L../core -lstatscore
