// @ts-ignore
import kill from 'kill-process';
import {Systeminformation} from "systeminformation";
import {ThunkAction} from "redux-thunk";

interface UpdateProcessInfo {
  type: 'UPDATE_PROCESS_INFO',
  processes: Systeminformation.ProcessesProcessData[]
}

interface ProcessKilled {
  type: 'PROCESS_KILLED',
  pid: number
}

export type ProcessActions = UpdateProcessInfo | ProcessKilled;

export function updateProcessInfo(processes: Systeminformation.ProcessesProcessData[]): UpdateProcessInfo {
  return {
    type: 'UPDATE_PROCESS_INFO',
    processes: processes
  }
}

export function processKilled(pid: number): ProcessKilled {
  return {
    type: 'PROCESS_KILLED',
    pid: pid
  }
}

export function killProcess(pid: number): ThunkAction<any, any, any, ProcessKilled> {
  return async (dispatch) => {
    await kill(pid);
    dispatch(processKilled(pid));
  };
}
