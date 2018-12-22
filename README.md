# TaskManager [![Build Status](https://travis-ci.com/RyanWangGit/task-manager.svg?branch=master)](https://travis-ci.com/RyanWangGit/task-manager) [![codecov](https://codecov.io/gh/RyanWangGit/task-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/RyanWangGit/task-manager)

A Windows-Like Task Manager Built for Linux and MacOS Based on Qt. Tested on `QT 5.8 - 5.11 Linux` and `QT latest MacOS`(via Homebrew).

<p float="left" align="center">
  <img src="https://github.com/RyanWangGit/TaskManager/raw/master/screenshots/1.png" width="45%" />
  &emsp;
  <img src="https://github.com/RyanWangGit/TaskManager/raw/master/screenshots/2.png" width="45%" /> 
</p>

Note: Some features are hard to implement on some specific platforms (such as memory speed under Linux, which all methods require `sudo` to the best of my knowledge), if a feature is not implemented yet it will simply display "No Data".

## Code Structure
Overall project structure:
```
- Project
  - core/
    - core.pri
    - 
  - tests/
    - test.pro
    - ...
  - app/
    - app.pro
    - src/
      - ...
```

`core` package is designed to be universal to handle the statistics collection. `StatsCore`(`statscore.h`) is the designed interface and `GenericStatsCore`(`genericstatscore.h / genericstatscore.cpp`) implements an abstract class which has some primitive generic statistic gathering methods (mostly based-on external program output such as `ps aux`). `MacStatsCore` and `LinuxStatsCore` subclasses `GenericStatsCore` and re-implements `updateProcesses()` / `gatherStaticSystemInfo()` / `updateSystemInformation` methods. Both of them make use of their platform-dependent advantage for statistics gathering, such as parsing `/proc` under Linux and calling `sysctlbyname` under MacOS.

`core` package may be used elsewhere, simply include the `core.pri` into the `.pro` file and the header file is located in `core/include/statscore.h`. Remember to use `StatsCore::createCore()` to automatically construct a `StatsCore` based on current system the project is building.

`app` package implements the whole GUI part, thanks to QT Widgets.

`tests` package implements basic tests for `core` package, ensuring the basic functionality.

## Libraries
This project uses [`QCustomPlot 2.0.1`](https://www.qcustomplot.com/index.php/introduction) for plotting the usage of CPU and memory. It is released as source code and is integrated directly into the project(see `qcustomplot.h` and `qcustomplot.cpp` files in this repository), so nothing should be installed or downloaded.

## License
[GPLv3](https://github.com/RyanWangGit/TaskManager/blob/master/LICENSE).
