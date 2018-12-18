include(../core/core.pri)

TARGET = testcore
QT += testlib

CONFIG += testcase
QMAKE_CXXFLAGS += --coverage
QMAKE_LFLAGS += --coverage
SOURCES += testcore.cpp
