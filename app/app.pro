TARGET = TaskManager
QT += core gui widgets printsupport sql
CONFIG += c++11
TEMPLATE = app

INCLUDEPATH += ../core/include src/
PRECOMPILED_HEADER  = stable.h

SOURCES += main.cpp\
    src/main_window.cpp \
    src/qcustomplot.cpp \
    src/usageplot.cpp \
    src/processproxymodel.cpp

HEADERS  += src/stable.h \
    src/main_window.h \
    src/qcustomplot.h \
    src/usageplot.h \
    src/processproxymodel.h

FORMS    += forms/main_window.ui

RESOURCES += \
    task_manager.qrc
