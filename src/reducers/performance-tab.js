import { UPDATE_PROCESS_INFO } from "../constants/action-types";

let initialState = {
  cpuLoadHistory: Array.from({length: 60}, () => 0),
  memLoadHistory: Array.from({length: 60}, () => 0)
};

export default function performanceTab(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PROCESS_INFO: {
      return Object.assign(state, {
        cpuLoadHistory: state.cpuLoadHistory.slice(1, state.cpuLoadHistory.length).concat([action.cpuLoad.currentload]),
        memLoadHistory: state.memLoadHistory.slice(1, state.memLoadHistory.length)
          .concat([(action.memLoad.active / action.memLoad.total) * 100])
      });
    }
    default:
      return state;
  }
}