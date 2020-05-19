import {CPUActions} from "../actions/cpu";
import {Systeminformation} from "systeminformation";

export interface CPUState {
  loadHistory: number[],
  currentSpeed: number,
  info: Systeminformation.CpuWithFlagsData
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
    speed: '0',
    socket: '',
    physicalCores: 0,
    cores: 0,
    vendor: '',
    family: '',
    model: '',
    stepping: '',
    revision: '',
    voltage: '',
    speedmin: '',
    speedmax: '',
    governor: '',
    processors: 0
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
