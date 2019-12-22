import { UPDATE_CPU_CURRENT_SPEED, UPDATE_CPU_INFO, UPDATE_CPU_LOAD } from "../constants/action-types";

let initialState = {
  loadHistory: Array.from({length: 60}, () => 0),
  info: {flags: '', cache: {l1i: 0, l1d: 0, l2: 0, l3: 0}, manufacturer: '', brand: '', speed: 0, socket: '',
    physicalCores: 0, cores: 0},
  currentSpeed: 0
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
        loadHistory: state.loadHistory.slice(1, state.loadHistory.length).concat([action.load.currentload])
      })
    }
    case UPDATE_CPU_CURRENT_SPEED: {
      return Object.assign(state, {
        currentSpeed: action.speed
      })
    }
    default:
      return state;
  }
}
