import {DiskActions} from "../actions/disk";

interface DiskState {
  readHistory: number[],
  writeHistory: number[]
}

let initialState: DiskState = {
  readHistory: Array.from({length: 60}, () => 0),
  writeHistory: Array.from({length: 60}, () => 0)
};

export default function disk(state = initialState, action: DiskActions) {
  switch(action.type) {
    case 'UPDATE_DISK_LOAD': {
      return {
        ...state,
        readHistory: state.readHistory.slice(1, state.readHistory.length).concat([action.load.rIO_sec]),
        writeHistory: state.readHistory.slice(1, state.writeHistory.length).concat([action.load.wIO_sec])
      }
    }
    default:
      return state;
  }
}