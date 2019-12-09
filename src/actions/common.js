import {currentLoad, mem, processes, cpu, memLayout, disksIO} from "systeminformation";
import { updateProcessInfo } from "./process";
import {updateDiskInfo, updateStaticInfo} from "./memory";


export function requestProcessInfo() {
  return async (dispatch) => {
    const [procs, curLoad, memory] = await Promise.all([processes(), currentLoad(), mem()]);
    dispatch(updateProcessInfo(procs, curLoad, memory));
  }
}

export function requestDiskInfo() {
  return async (dispatch) => {
    const disk = await disksIO();
    dispatch(updateDiskInfo(disk));
  }
}


export function requestStaticInfo() {
  return async (dispatch) => {
    const [cpuInfo, memInfo] = await Promise.all([cpu(), memLayout()]);
    dispatch(updateStaticInfo({
      cpu: cpuInfo,
      mem: memInfo
    }));
  }
}
