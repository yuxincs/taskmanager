#-------------------------------------------------
#
# Project created by QtCreator 2016-01-06T09:44:06
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = TaskManager
TEMPLATE = app


SOURCES += main.cpp\
        Mainwindow.cpp \
    Process.cpp

HEADERS  += Mainwindow.h \
    stable.h \
    Process.h

FORMS    += Mainwindow.ui

# Use Precompiled headers (PCH)
PRECOMPILED_HEADER  = stable.h

# Enable multi-processor
#QMAKE_CXXFLAGS += -MP
