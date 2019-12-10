import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Icon, Tabs } from 'antd';
import styles from './index.module.css';
import ProcessTabContainer from './containers/process-tab';
import PerformanceTabContainer from "./containers/performance-tab";
import reducer from './reducers';
import { requestCPUCurrentSpeed, requestCPUInfo, requestCPULoad } from "./actions/cpu";
import { requestMemoryInfo, requestMemoryLoad } from "./actions/memory";
import { requestProcessInfo } from "./actions/process";
import { requestDiskLoad } from "./actions/disk";

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware.push(loggerMiddleware);
}


const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

const requestStaticInfo = () => {
  store.dispatch(requestCPUInfo());
  store.dispatch(requestMemoryInfo());
};

const requestDynamicInfo = () => {
  store.dispatch(requestProcessInfo());
  store.dispatch(requestCPULoad());
  store.dispatch(requestCPUCurrentSpeed());
  store.dispatch(requestMemoryLoad());
  store.dispatch(requestDiskLoad());
};

// first dispatch the actions to request static information (only once)
requestStaticInfo();
requestDynamicInfo();

// periodically request dynamic information about process / cpu / memory / disk load etc.
setInterval(requestDynamicInfo, 1500);


class TaskManager extends React.Component{
  render() {
    return (
      <Tabs
        className={styles.tabs}
        tabBarStyle={{margin: 0}}
        defaultActiveKey="1"
        size="small" 
        >
        <Tabs.TabPane className={styles.tabPanes}
          tab={
            <span>
              <Icon type="switcher" />
              Processes
            </span>
          }
          key="1">
          <ProcessTabContainer />
        </Tabs.TabPane>
        <Tabs.TabPane className={styles.tabPanes}
          tab={
            <span>
              <Icon type="rocket" />
              Performance
            </span>
          }
          key="2">
        <PerformanceTabContainer />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

document.getElementById('root').className += ' ' + styles.root;

ReactDOM.render(
  <Provider store={store}>
    <TaskManager />
  </Provider>,
  document.getElementById('root')
);
