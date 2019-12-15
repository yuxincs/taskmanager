import React from 'react';
import ReactDOM from 'react-dom';
import PerformanceTab from "./performance-tab";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PerformanceTab />, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('renders with dummy history data', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PerformanceTab
    cpuLoadHistory={Array.from({length: 60}, () => Math.random() * 100)}
    memoryLoadHistory={Array.from({length: 60}, () => Math.random() * 100)}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});