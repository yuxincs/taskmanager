QT       += core sql
CONFIG   += c++11

INCLUDEPATH += $$PWD/include

SOURCES += $$PWD/src/statscore.cpp \
    $$PWD/src/linuxstatscore.cpp \
    $$PWD/src/macstatscore.cpp \

HEADERS  += $$PWD/include/statscore.h \
    $$PWD/src/linuxstatscore.h \
    $$PWD/src/macstatscore.h \
