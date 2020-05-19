import React from 'react';
import ReactDOM from 'react-dom';
import PerformanceTab from "./performance-tab";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import reducer from "../reducers";
import thunkMiddleware from "redux-thunk";
import {cpu, cpuCurrentspeed, cpuFlags, currentLoad, disksIO, mem, memLayout, processes, time} from "systeminformation";
import {updateCPUCurrentSpeed, updateCPUInfo, updateCPULoad} from "../actions/cpu";
import {updateMemoryInfo, updateMemoryLoad} from "../actions/memory";
import {updateProcessInfo} from "../actions/process";
import {updateDiskLoad} from "../actions/disk";
import {UpdateUpTime} from "../actions/general";

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><PerformanceTab /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('renders with history data', () => {
  const div = document.createElement('div');
  // request static and dynamic information once for data to be populated
  Promise.all([cpu(), cpuFlags()]).then(
    ([info, flags]) => store.dispatch(updateCPUInfo({...info, flags: flags}))
  );
  memLayout().then((info) => store.dispatch(updateMemoryInfo(info)));
  currentLoad().then((load) => store.dispatch(updateCPULoad(load)));
  cpuCurrentspeed().then((speed) => store.dispatch(updateCPUCurrentSpeed(speed.avg)));
  mem().then((load) => store.dispatch(updateMemoryLoad(load)));
  processes().then((procs) => store.dispatch(updateProcessInfo(procs.list)));
  disksIO().then((load) => store.dispatch(updateDiskLoad(load)));
  store.dispatch(UpdateUpTime(parseInt(time().uptime)));
  ReactDOM.render(<Provider store={store}><PerformanceTab /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});