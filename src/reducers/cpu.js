import { UPDATE_CPU_INFO, UPDATE_CPU_LOAD } from "../constants/action-types";

let initialState = {
  loadHistory: Array.from({length: 60}, () => 0),
  info: {}
};

export default function cpu(state = initialState, action) {
  switch(action.type) {
    case UPDATE_CPU_INFO: {
      return Object.assign(state, {
        info: action.info
      });
    }
    case UPDATE_CPU_LOAD: {
      return Object.assign(state, {
        loadHistory: state.loadHistory.slice(1, state.loadHistory.length).concat([action.currentload])
      })
    }
    default:
      return state;
  }
}
