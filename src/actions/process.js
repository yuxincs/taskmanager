import kill from 'kill-process';
import { UPDATE_PROCESS_INFO, PROCESS_KILLED } from '../constants/action-types';
import { currentLoad, mem, processes } from "systeminformation";


export function requestProcessInfo() {
  return async (dispatch) => {
    const [procs, curLoad, memory] = await Promise.all([processes(), currentLoad(), mem()]);
    dispatch(updateProcessInfo(procs, curLoad, memory));
  }
}


export function updateProcessInfo(processes) {
  return {
    type: UPDATE_PROCESS_INFO,
    processes: processes
  }
}

export function processKilled(pid) {
  return {
    type: PROCESS_KILLED,
    pid: pid
  }
}

export function killProcess(pid) {
  return async (dispatch) => {
    await kill(pid);
    dispatch(processKilled(pid));
  };
}
