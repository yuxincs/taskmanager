TARGET = TaskManager
TEMPLATE = subdirs
SUBDIRS += core app tests

app.depends = core
tests.depends = core
