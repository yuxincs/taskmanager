# TaskManager 

[![Github Actions](https://github.com/yuxincs/taskmanager/workflows/build/badge.svg)](https://github.com/yuxincs/taskmanager/actions?query=branch%3Amain) [![codecov](https://codecov.io/gh/yuxincs/taskmanager/branch/main/graph/badge.svg)](https://codecov.io/gh/yuxincs/taskmanager)

A Windows-Like Task Manager built for Linux and macOS, based on [Electron](https://electronjs.org/), [Ant Design](https://ant.design/), [systeminformation](https://www.npmjs.com/package/systeminformation) and [ECharts](https://www.echartsjs.com/en/index.html).

<p float="left" align="center">
  <img src="https://github.com/yuxincs/taskmanager/raw/main/screenshots/1.png" width="45%" />
  &emsp;
  <img src="https://github.com/yuxincs/taskmanager/raw/main/screenshots/2.png" width="45%" /> 
  
</p>

Previously there is a C++ version based on QT, at [v1.0-qt-based](https://github.com/yuxincs/taskmanager/tree/v1.0-qt-based) branch.

## Run
This project is managed by [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) and yarn. 

Simply run `yarn install` and `yarn electron-dev` to run the taskmanager in develop mode or `yarn electron-pack` to pack it for different platforms.

## TODO

* Per-process network / diskIO statistics display.

## License
[MIT](https://github.com/yuxincs/taskmanager/blob/master/LICENSE).
