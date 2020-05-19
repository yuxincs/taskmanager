import React from 'react';
import ReactDOM from 'react-dom';
import PerformanceTab from "./performance-tab";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import reducer from "../reducers";
import thunkMiddleware from "redux-thunk";
import { requestCPUCurrentSpeed, requestCPUInfo, requestCPULoad } from "../actions/cpu";
import { requestDiskLoad } from "../actions/disk";
import { requestProcessInfo } from "../actions/process";
import { requestMemoryInfo, requestMemoryLoad } from "../actions/memory";
import { requestGeneralInfo } from "../actions/general";

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
  store.dispatch(requestCPUInfo());
  store.dispatch(requestMemoryInfo());
  store.dispatch(requestGeneralInfo());
  store.dispatch(requestProcessInfo());
  store.dispatch(requestCPULoad());
  store.dispatch(requestCPUCurrentSpeed());
  store.dispatch(requestMemoryLoad());
  store.dispatch(requestDiskLoad());
  ReactDOM.render(<Provider store={store}><PerformanceTab /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});