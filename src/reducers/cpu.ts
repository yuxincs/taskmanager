import {CPUActions} from "../actions/cpu";

interface CPUState {
  loadHistory: Array<number>,
  currentSpeed: number,
  info: {
    flags: string,
    cache: {
      l1i: number,
      l1d: number,
      l2: number,
      l3: number
    },
    manufacturer: string,
    brand: string,
    speed: number,
    socket: string,
    physicalCores: number,
    cores: number
  }
}

let initialState: CPUState = {
  loadHistory: Array.from({length: 60}, () => 0),
  currentSpeed: 0,
  info: {
    flags: '',
    cache: {
      l1i: 0,
      l1d: 0,
      l2: 0,
      l3: 0
    },
    manufacturer: '',
    brand: '',
    speed: 0,
    socket: '',
    physicalCores: 0,
    cores: 0
  }
};

export default function cpu(state = initialState, action: CPUActions): CPUState {

  switch(action.type) {
    case 'UPDATE_CPU_INFO': {
      return {
        ...state,
        info: action.info
      }
    }
    case 'UPDATE_CPU_LOAD': {
      return {
        ...state,
        loadHistory: state.loadHistory.slice(1, state.loadHistory.length).concat([action.load.currentload])
      }
    }
    case 'UPDATE_CPU_CURRENT_SPEED': {
      return {
        ...state,
        currentSpeed: action.speed
      }
    }
    default:
      return state;
  }
}
