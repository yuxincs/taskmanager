# TaskManager 

[![Github Actions](https://github.com/yxwangcs/taskmanager/workflows/build/badge.svg)](https://github.com/yxwangcs/taskmanager/actions?query=branch%3Amaster) [![codecov](https://codecov.io/gh/yxwangcs/taskmanager/branch/master/graph/badge.svg)](https://codecov.io/gh/yxwangcs/taskmanager/branch/master)

A Windows-Like Task Manager built for Linux and macOS, based on [Electron](https://electronjs.org/), [Ant Design](https://ant.design/), [systeminformation](https://www.npmjs.com/package/systeminformation) and [ECharts](https://www.echartsjs.com/en/index.html).

<p float="left" align="center">
  <img src="https://github.com/yxwangcs/taskmanager/raw/master/screenshots/1.png" width="32%" />
  &emsp;
  <img src="https://github.com/yxwangcs/taskmanager/raw/master/screenshots/2.png" width="32%" /> 
  
  <img src="https://github.com/yxwangcs/taskmanager/raw/master/screenshots/3.png" width="32%" /> 
</p>

Previously there is a C++ version based on QT, at [v1.0-qt-based](https://github.com/yxwangcs/taskmanager/tree/v1.0-qt-based) branch.

## TODO
* Rework the state tree (some states are shared and should be extracted to a common state).

* Per-process network / diskIO statistics display.

## License
[MIT](https://github.com/yxwangcs/taskmanager/blob/master/LICENSE).
