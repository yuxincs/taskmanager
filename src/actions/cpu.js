import { UPDATE_CPU_INFO, UPDATE_CPU_LOAD } from "../constants/action-types";
import { cpu, currentLoad } from "systeminformation";

export function requestCPULoad() {
  return async (dispatch) => {
    const load = await currentLoad();
    dispatch(updateCPULoad(load));
  }
}

export function requestCPUInfo() {
  return async (dispatch) => {
    const info = await cpu();
    dispatch(updateCPUInfo(info));
  }
}


export function updateCPULoad(load) {
  return {
    type: UPDATE_CPU_LOAD,
    load: load
  }
}

export function updateCPUInfo(info) {
  return {
    type: UPDATE_CPU_INFO,
    info: info
  }
}

