import process from './reducers/process';
import memory from "./reducers/memory";
import { combineReducers } from "redux";

const reducer = combineReducers({
  processTab: process,
  performanceTab: memory
});

export default reducer;