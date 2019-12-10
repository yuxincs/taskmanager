import process from './reducers/process';
import memory from "./reducers/memory";
import disk from "./reducers/disk";
import cpu from "./reducers/cpu";
import { combineReducers } from "redux";

const reducer = combineReducers({
  process: process(),
  cpu: cpu(),
  memory: memory(),
  disk: disk()
});

export default reducer;