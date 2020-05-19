import {Systeminformation} from "systeminformation";
import {ProcessActions} from "../actions/process";

export interface ProcessState {
  processes: Systeminformation.ProcessesProcessData[]
}

let initialState: ProcessState = {
  processes: []
};

export default function process(state = initialState, action: ProcessActions) {
  switch(action.type) {
    case 'UPDATE_PROCESS_INFO': {
      return {
        ...state,
        processes: action.processes
      }
    }
    default:
      return state;
  }
}