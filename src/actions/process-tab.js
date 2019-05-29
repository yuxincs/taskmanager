import { processes, currentLoad, mem } from 'systeminformation';
import { UPDATE_PROCESS_INFO } from '../constants/action-types';

export function updateProcessInfo(processInfo, cpuLoad, memLoad) {
  return {
    type: UPDATE_PROCESS_INFO,
    processes: processInfo,
    cpuLoad: cpuLoad,
    memLoad: memLoad
  }
}


export function requestProcessInfo() {
  return (dispatch) => {
    processes(processData => {
      currentLoad(cpuLoad => {
        mem(memLoad => {
          dispatch(updateProcessInfo(processData, cpuLoad, memLoad));
        })
      })
    })
  }
}
