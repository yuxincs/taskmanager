TARGET = TaskManager
QT       += core gui widgets printsupport sql testlib
CONFIG   += c++11

INCLUDEPATH += core \
    ui

PRECOMPILED_HEADER  = core/stable.h

SOURCES += core/main.cpp\
    core/statscore.cpp \
    ui/main_window.cpp \
    ui/qcustomplot.cpp \
    ui/usageplot.cpp \
    core/linuxstatscore.cpp \
    ui/processproxymodel.cpp \
    tests/testcore.cpp

HEADERS  += core/stable.h \
    core/statscore.h \
    ui/main_window.h \
    ui/qcustomplot.h \
    ui/usageplot.h \
    core/linuxstatscore.h \
    ui/processproxymodel.h

FORMS    += forms/main_window.ui

RESOURCES += \
    task_manager.qrc
