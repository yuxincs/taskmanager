include(../core/core.pri)
TARGET = ../TaskManager # move target one dir up to top-level
QT += core gui widgets printsupport sql
CONFIG += c++11
TEMPLATE = app

INCLUDEPATH += src/
PRECOMPILED_HEADER = src/stable.h

SOURCES += main.cpp\
    src/mainwindow.cpp \
    src/qcustomplot.cpp \
    src/usageplot.cpp \
    src/processproxymodel.cpp

HEADERS  += src/stable.h \
    src/mainwindow.h \
    src/qcustomplot.h \
    src/usageplot.h \
    src/processproxymodel.h

FORMS    += forms/mainwindow.ui

RESOURCES += \
    taskmanager.qrc
