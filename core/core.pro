TARGET = statscore
QT       += core sql
CONFIG   += c++11
TEMPLATE = lib

INCLUDEPATH += src include

PRECOMPILED_HEADER  = src/stable.h

SOURCES += src/statscore.cpp \
    src/linuxstatscore.cpp

HEADERS  += include/statscore.h \
    src/stable.h \
    src/linuxstatscore.h
