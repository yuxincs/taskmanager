#-------------------------------------------------
#
# Project created by QtCreator 2016-01-06T09:44:06
#
#-------------------------------------------------

QT       += core gui
CONFIG   += c++11

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets printsupport

TARGET = TaskManager
TEMPLATE = app

SOURCES += main.cpp\
        Mainwindow.cpp \
    Process.cpp \
    ProcessTableModel.cpp \
    PerformanceModel.cpp \
    qcustomplot.cpp \
    UsagePlot.cpp

HEADERS  += Mainwindow.h \
    stable.h \
    Process.h \
    ProcessTableModel.h \
    PerformanceModel.h \
    qcustomplot.h \
    UsagePlot.h

FORMS    += Mainwindow.ui

# Use Precompiled headers (PCH)
PRECOMPILED_HEADER  = stable.h

RESOURCES += \
    taskmanager.qrc

