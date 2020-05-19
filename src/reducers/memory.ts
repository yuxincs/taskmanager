import {MemoryActions} from "../actions/memory";
import {Systeminformation} from "systeminformation";


export interface MemoryState {
  loadHistory: number[],
  load: Systeminformation.MemData,
  info: Systeminformation.MemLayoutData[]
}

let initialState: MemoryState = {
  loadHistory: Array.from({length: 60}, () => 0),
  load: {
    used: 0,
    buffers: 0,
    swapused: 0,
    free: 0,
    cached: 0,
    swapfree: 0,
    total: 0,
    active: 0,
    available: 0,
    buffcache: 0,
    slab: 0,
    swaptotal: 0
  },
  info: [
    {
      size: 0,
      clockSpeed: 0,
      formFactor: '',
      bank: '',
      type: '',
      voltageConfigured: 0,
      voltageMax: 0,
      voltageMin: 0,
      partNum: '',
      serialNum: ''
    }
  ]
};

export default function memory(state = initialState, action: MemoryActions) {
  switch(action.type) {
    case 'UPDATE_MEMORY_INFO': {
      return {
        ...state,
        info: action.info
      }
    }
    case 'UPDATE_MEMORY_LOAD': {
      return {
        ...state,
        loadHistory: state.loadHistory.slice(1, state.loadHistory.length).concat(
          [(action.load.active / action.load.total) * 100]),
        load: action.load
      }
    }
    default:
      return state;
  }
}
