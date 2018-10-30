# TaskManager-QT [![Build Status](https://travis-ci.com/RyanWangGit/TaskManager-QT.svg?branch=master)](https://travis-ci.com/RyanWangGit/TaskManager-QT)

A Windows-Like Task Manager Built for Linux Based on Qt.

Tested on `QT 5.4 - 5.11 Linux` and `QT 5.5 and latest MacOS`.

## Features
* Windows-Like UI design.
* Processes monitor.
* Utilization shown in different shades.
* Auto-plotting the usage of different resources.
* More information about memory.

## Screenshots
![#1](https://github.com/RyanWangGit/TaskManager/raw/master/Screenshots/1.png)

![#1](https://github.com/RyanWangGit/TaskManager/raw/master/Screenshots/2.png)

## Libraries
This project uses [`QCustomPlot 2.0.1`](https://www.qcustomplot.com/index.php/introduction) for plotting the usage of CPU and memory. It is released as source code and can be compiled directly into the project(see `qcustomplot.h` and `qcustomplot.cpp` files in this repository), so nothing should be installed or downloaded.

## License
[GPLv3](https://github.com/RyanWangGit/TaskManager/blob/master/LICENSE).
