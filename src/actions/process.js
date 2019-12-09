import kill from 'kill-process';
import { UPDATE_PROCESS_INFO, PROCESS_KILLED } from '../constants/action-types';

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
