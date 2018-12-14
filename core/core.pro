TARGET = statscore
QT       += core sql
CONFIG   += c++11 staticlib
TEMPLATE = lib

QMAKE_CXXFLAGS += --coverage
QMAKE_LFLAGS += --coverage

INCLUDEPATH += src include

SOURCES += src/statscore.cpp \
    src/linuxstatscore.cpp

HEADERS  += include/statscore.h \
    src/linuxstatscore.h
