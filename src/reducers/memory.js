import { UPDATE_MEMORY_INFO, UPDATE_MEMORY_LOAD } from "../constants/action-types";

let initialState = {
  loadHistory: Array.from({length: 60}, () => 0),
  total: 1,
  used: 0,
  info: {}
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
        used: action.load.used,
        total: action.load.total
      })
    }
    default:
      return state;
  }
}
