import { processes, currentLoad, mem } from 'systeminformation';
import kill from 'kill-process';
import { UPDATE_PROCESS_INFO, PROCESS_KILLED } from '../constants/action-types';

export function updateProcessInfo(processInfo, cpuLoad, memLoad) {
  return {
    type: UPDATE_PROCESS_INFO,
    processes: processInfo,
    cpuLoad: cpuLoad,
    memLoad: memLoad
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


export function requestProcessInfo() {
  return async (dispatch) => {
    const [procs, curLoad, memory] = await Promise.all([processes(), currentLoad(), mem()]);

    // sort the process list by its parent pid for later use
    procs.list = procs.list.sort((a, b) => a.parentPid - b.parentPid);

    // create an empty root node with pid 0
    let root = {children: []};

    // process map from pid to node
    let processMap = { 0 : root };

    for(const process of procs.list) {
      // move the children of init process (pid 1) directly to the root node for better readability
      // otherwise the tree would look like a single process -> all other processes
      if(process.pid === 1) {
        processMap[process.pid] = root;
      }
      else {
        processMap[process.pid] = process;
      }
      if(typeof processMap[process.parentPid].children === 'undefined') {
        processMap[process.parentPid].children = [];
      }
      processMap[process.parentPid].children.push(process);
    }

    // flatten the pid 1 init process for better readability
    procs.list = root.children;
    dispatch(updateProcessInfo(procs, curLoad, memory));
  }
}
