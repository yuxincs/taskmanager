import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, Middleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Tabs } from 'antd';
import { RocketOutlined, SwitcherOutlined } from "@ant-design/icons";
import styles from './index.module.css';
import ProcessTab from './components/process-tab';
import PerformanceTab from "./components/performance-tab";
import reducer from './reducers';
import {updateCPUCurrentSpeed, updateCPUInfo, updateCPULoad} from "./actions/cpu";
import {updateMemoryInfo, updateMemoryLoad} from "./actions/memory";
import {updateProcessInfo} from "./actions/process";
import {updateDiskLoad} from "./actions/disk";
import {UpdateUpTime} from './actions/general';
import {cpu, cpuCurrentspeed, cpuFlags, currentLoad, disksIO, mem, memLayout, processes, time} from "systeminformation";
import './override.css';

let middleware: Array<Middleware> = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware.push(loggerMiddleware);
}


const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

const requestStaticInfo = () => {
  Promise.all([cpu(), cpuFlags()]).then(
    ([info, flags]) => store.dispatch(updateCPUInfo({...info, flags: flags}))
  );
  memLayout().then((info) => store.dispatch(updateMemoryInfo(info)));
};


const requestDynamicInfo = () => {
  // request CPU Load
  currentLoad().then((load) => store.dispatch(updateCPULoad(load)));
  // request cpu current speed
  cpuCurrentspeed().then((speed) => store.dispatch(updateCPUCurrentSpeed(speed.avg)));
  // request memory load
  mem().then((load) => store.dispatch(updateMemoryLoad(load)));
  // request process info
  processes().then((procs) => store.dispatch(updateProcessInfo(procs.list)));
  // request disk IO information
  disksIO().then((load) => store.dispatch(updateDiskLoad(load)));
  // request uptime
  store.dispatch(UpdateUpTime(parseInt(time().uptime)));
};

// first dispatch the actions to request static information (only once)
requestStaticInfo();
requestDynamicInfo();

// periodically request dynamic information about process / cpu / memory / disk load etc.
setInterval(requestDynamicInfo, 1000);


const TaskManager = () => {
  return (
    <Tabs
      className={styles.tabs}
      tabBarStyle={{margin: 0}}
      defaultActiveKey="1"
      size="small"
    >
      <Tabs.TabPane
        className={styles.tabPanes}
        tab={
          <div>
            <SwitcherOutlined />Processes
          </div>
        }
        key="1">
        <ProcessTab />
      </Tabs.TabPane>
      <Tabs.TabPane
        className={styles.tabPanes}
        tab={
          <div>
            <RocketOutlined />Performance
          </div>
        }
        key="2">
        <PerformanceTab />
      </Tabs.TabPane>
    </Tabs>
  );
};

let rootElement = document.getElementById('root');

rootElement!.className += ' ' + styles.root;

ReactDOM.render(
  <Provider store={store}>
    <TaskManager />
  </Provider>,
  rootElement
);
