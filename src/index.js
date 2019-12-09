import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Icon, Tabs } from 'antd';
import styles from './index.module.css';
import {requestDiskInfo, requestProcessInfo, requestStaticInfo} from "./actions/requests";
import ProcessTabContainer from './containers/process-tab';
import PerformanceTabContainer from "./containers/performance-tab";
import reducer from './reducers';

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware.push(loggerMiddleware);
}


const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

store.dispatch(requestProcessInfo());
store.dispatch(requestDiskInfo());
store.dispatch(requestStaticInfo());

setInterval(() => {
  store.dispatch(requestProcessInfo());
  store.dispatch(requestDiskInfo());
}, 1500);


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
