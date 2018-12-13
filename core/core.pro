TARGET = statscore
QT       += core sql
CONFIG   += c++11 staticlib
TEMPLATE = lib

INCLUDEPATH += src include

SOURCES += src/statscore.cpp \
    src/linuxstatscore.cpp

HEADERS  += include/statscore.h \
    src/linuxstatscore.h
