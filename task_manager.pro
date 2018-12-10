TARGET = TaskManager
QT       += core gui widgets printsupport sql
CONFIG   += c++11

INCLUDEPATH += core \
    ui

PRECOMPILED_HEADER  = core/stable.h

SOURCES += core/main.cpp\
    core/statscore.cpp \
    ui/main_window.cpp \
    ui/qcustomplot.cpp \
    core/linuxstatscore.cpp \
    ui/usageplot.cpp

HEADERS  += core/stable.h \
    core/statscore.h \
    ui/main_window.h \
    ui/qcustomplot.h \
    core/linuxstatscore.h \
    ui/usageplot.h

FORMS    += forms/main_window.ui

RESOURCES += \
    task_manager.qrc
