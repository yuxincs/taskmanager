import { UPDATE_CPU_CURRENT_SPEED, UPDATE_CPU_INFO, UPDATE_CPU_LOAD } from "../constants/action-types";
import { cpu, cpuCurrentspeed, cpuFlags, currentLoad } from "systeminformation";

export function requestCPULoad() {
  return async (dispatch) => {
    const load = await currentLoad();
    dispatch(updateCPULoad(load));
  }
}

export function requestCPUInfo() {
  return async (dispatch) => {
    const [info, flags] = await Promise.all([cpu(), cpuFlags()]);
    info.flags = flags;
    dispatch(updateCPUInfo(info));
  }
}

export function requestCPUCurrentSpeed() {
  return async (dispatch) => {
    const speed = await cpuCurrentspeed();
    dispatch(updateCPUCurrentSpeed(speed.avg));
  }
}

export function updateCPUCurrentSpeed(speed) {
  return {
    type: UPDATE_CPU_CURRENT_SPEED,
    speed: speed
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

