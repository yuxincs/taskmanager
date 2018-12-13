TARGET = testcore
QT = core sql testlib

CONFIG += testcase

INCLUDEPATH += ../core/include
SOURCES += testcore.cpp

LIBS += -L../core -lstatscore
