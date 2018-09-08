TARGET = TaskManager
QT       += core gui widgets printsupport
CONFIG   += c++11

INCLUDEPATH += ./core \
    ./ui

PRECOMPILED_HEADER  = ./core/stable.h

SOURCES += ./core/main.cpp\
    ./core/process.cpp \
    ./ui/main_window.cpp \
    ./ui/process_table_model.cpp \
    ./ui/performance_model.cpp \
    ./ui/qcustomplot.cpp \
    ./ui/usage_plot.cpp

HEADERS  += ./core/stable.h \
    ./core/process.h \
    ./ui/main_window.h \
    ./ui/process_table_model.h \
    ./ui/performance_model.h \
    ./ui/qcustomplot.h \
    ./ui/usage_plot.h

FORMS    += ./forms/main_window.ui



RESOURCES += \
    task_manager.qrc

