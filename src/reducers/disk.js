import { UPDATE_DISK_LOAD } from "../constants/action-types";

let initialState = {
  readHistory: Array.from({length: 60}, () => 0),
  writeHistory: Array.from({length: 60}, () => 0)
};

export default function disk(state = initialState, action) {
  switch(action.type) {
    case UPDATE_DISK_LOAD: {
      return Object.assign({}, state, {
        readHistory: state.readHistory.slice(1, state.loadHistory.length).concat([action.rIO_sec]),
        writeHistory: state.readHistory.slice(1, state.loadHistory.length).concat([action.wIO_sec])
      });
    }
    default:
      return state;
  }
}