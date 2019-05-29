import { UPDATE_PROCESS_INFO } from "../constants/action-types";

let initialState = {
  data: {
    all: 0,
    blocked: 0,
    running: 0,
    sleeping: 0,
    unknown: 0,
    list: []
  }
};

export default function processTab(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PROCESS_INFO: {
      return Object.assign({}, state, {
        data: action.processes
      });
    }
    default:
      return state;
  }
}