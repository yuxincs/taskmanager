import {currentLoad, mem, processes, cpu, memLayout} from "systeminformation";
import { updateProcessInfo } from "./process-tab";
import { updateStaticInfo } from "./performance-tab";


export function requestProcessInfo() {
  return async (dispatch) => {
    const [procs, curLoad, memory] = await Promise.all([processes(), currentLoad(), mem()]);
    dispatch(updateProcessInfo(procs, curLoad, memory));
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
