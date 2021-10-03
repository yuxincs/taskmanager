# TaskManager 

[![Github Actions](https://github.com/yxwangcs/taskmanager/workflows/build/badge.svg)](https://github.com/yxwangcs/taskmanager/actions?query=branch%3Amain) [![codecov](https://codecov.io/gh/yxwangcs/taskmanager/branch/main/graph/badge.svg)](https://codecov.io/gh/yxwangcs/taskmanager)

A Windows-Like Task Manager built for Linux and macOS, based on [Electron](https://electronjs.org/), [Ant Design](https://ant.design/), [systeminformation](https://www.npmjs.com/package/systeminformation) and [ECharts](https://www.echartsjs.com/en/index.html).

<p float="left" align="center">
  <img src="https://github.com/yxwangcs/taskmanager/raw/main/screenshots/1.png" width="45%" />
  &emsp;
  <img src="https://github.com/yxwangcs/taskmanager/raw/main/screenshots/2.png" width="45%" /> 
  
</p>

Previously there is a C++ version based on QT, at [v1.0-qt-based](https://github.com/yxwangcs/taskmanager/tree/v1.0-qt-based) branch.

## Run
This project is managed by [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) and yarn. 

Simply run `yarn install` and `yarn electron-dev` to run the taskmanager in develop mode or `yarn electron-pack` to pack it for different platforms.

## TODO

* Per-process network / diskIO statistics display.

## License
[MIT](https://github.com/yxwangcs/taskmanager/blob/master/LICENSE).
