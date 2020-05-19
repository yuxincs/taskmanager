import React from 'react';
import ReactDOM from 'react-dom';
import PerformanceTab from "./performance-tab";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import reducer from "../reducers";
import thunkMiddleware from "redux-thunk";
import {requestDynamicInfo, requestStaticInfo} from "../index";

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
  requestStaticInfo();
  requestDynamicInfo();
  ReactDOM.render(<Provider store={store}><PerformanceTab /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});