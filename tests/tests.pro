TARGET = testcore
QT = core sql testlib

CONFIG += testcase
QMAKE_CXXFLAGS += --coverage
QMAKE_LFLAGS += --coverage
INCLUDEPATH += ../core/include
SOURCES += testcore.cpp

LIBS += -L../core -lstatscore
