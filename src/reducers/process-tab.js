import { UPDATE_PROCESS_INFO } from "../constants/action-types";

let initialState = {
  processes: {
    all: 0,
    blocked: 0,
    running: 0,
    sleeping: 0,
    unknown: 0,
    list: []
  },
  cpuLoad: {
    currentload: 0
  },
  memLoad: {
    total: 1,
    free: 1
  }
};

export default function processTab(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PROCESS_INFO: {
      return Object.assign({}, state, {
        processes: action.processes,
        cpuLoad: action.cpuLoad,
        memLoad: action.memLoad
      });
    }
    default:
      return state;
  }
}