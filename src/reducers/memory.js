import {UPDATE_DISK_INFO, UPDATE_PROCESS_INFO, UPDATE_STATIC_INFO} from "../constants/action-types";

let initialState = {
  cpuLoadHistory: Array.from({length: 60}, () => 0),
  memLoadHistory: Array.from({length: 60}, () => 0),
  cpuStatic: {},
  memoryStatic: {},
  cpuDynamic: {},
  memoryDynamic: {},
  diskInfo: {}
};

export default function memory(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PROCESS_INFO: {
      return Object.assign(state, {
        cpuLoadHistory: state.cpuLoadHistory.slice(1, state.cpuLoadHistory.length).concat([action.cpuLoad.currentload]),
        memLoadHistory: state.memLoadHistory.slice(1, state.memLoadHistory.length)
          .concat([(action.memLoad.active / action.memLoad.total) * 100]),
        memoryDynamic: action.memLoad
      });
    }
    case UPDATE_STATIC_INFO: {
      return Object.assign(state, {
        cpuStatic: action.staticInfo.cpu,
        memoryStatic: action.staticInfo.mem
      });
    }
    case UPDATE_DISK_INFO: {
      return Object.assign(state, {
        diskInfo: action.diskInfo
      })
    }
    default:
      return state;
  }
}