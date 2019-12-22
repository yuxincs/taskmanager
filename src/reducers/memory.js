import { UPDATE_MEMORY_INFO, UPDATE_MEMORY_LOAD } from "../constants/action-types";

let initialState = {
  loadHistory: Array.from({length: 60}, () => 0),
  load: {used: 0, buffers: 0, swapused: 0, free: 0, cached: 0, swapfree: 0},
  info: [{size: 0, clockSpeed: 0, formFactor: ''}, {size: 1, clockSpeed: 0, formFactor: ''}]
};

export default function memory(state = initialState, action) {
  switch(action.type) {
    case UPDATE_MEMORY_INFO: {
      return Object.assign(state, {
        info: action.info
      });
    }
    case UPDATE_MEMORY_LOAD: {
      return Object.assign(state, {
        loadHistory: state.loadHistory.slice(1, state.loadHistory.length).concat(
          [(action.load.active / action.load.total) * 100]),
        load: action.load
      })
    }
    default:
      return state;
  }
}
