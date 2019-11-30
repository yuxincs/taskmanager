import processTab from './reducers/process-tab';
import performanceTab from "./reducers/performance-tab";
import { combineReducers } from "redux";

const reducer = combineReducers({
  processTab,
  performanceTab
});

export default reducer;