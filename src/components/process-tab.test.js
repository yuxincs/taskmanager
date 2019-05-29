import React from 'react';
import ReactDOM from 'react-dom';
import ProcessTab from './process-tab';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProcessTab
    processes={{all:0, blocked: 0, running: 0, sleeping: 0, unknown: 0, list: []}}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('renders with processes', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProcessTab
    processes={{all:0, blocked: 0, running: 0, sleeping: 0, unknown: 0,
      list: [
        {command: 'test', pid: 1, pcpu: 0, pmem: 1}
    ]}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});