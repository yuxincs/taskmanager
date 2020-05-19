import { UPDATE_CPU_CURRENT_SPEED, UPDATE_CPU_INFO, UPDATE_CPU_LOAD } from "../constants/action-types";
import {cpu, cpuCurrentspeed, cpuFlags, currentLoad, Systeminformation} from "systeminformation";
import {ThunkAction} from 'redux-thunk';

interface UpdateCPUCurrentSpeedAction {
  type: typeof UPDATE_CPU_CURRENT_SPEED,
  speed: number
}

interface UpdateCPULoadAction {
  type: typeof UPDATE_CPU_LOAD,
  load: Systeminformation.CurrentLoadData
}

interface UpdateCPUInfo {
  type: typeof UPDATE_CPU_INFO,
  info: Systeminformation.CpuWithFlagsData
}

type RequestCPULoadAction = ThunkAction<any, any, any, UpdateCPULoadAction>;
type RequestCPUInfoAction = ThunkAction<any, any, any, UpdateCPUInfo>;
type RequestCPUCurrentSpeedAction = ThunkAction<any, any, any, UpdateCPUCurrentSpeedAction>;
export type CPUActions = RequestCPUCurrentSpeedAction | RequestCPULoadAction | RequestCPUInfoAction |
  UpdateCPUCurrentSpeedAction | UpdateCPUInfo | UpdateCPULoadAction;

export function updateCPUCurrentSpeed(speed: number): UpdateCPUCurrentSpeedAction {
  return {
    type: UPDATE_CPU_CURRENT_SPEED,
    speed: speed
  }
}

export function updateCPULoad(load: Systeminformation.CurrentLoadData): UpdateCPULoadAction {
  return {
    type: typeof UPDATE_CPU_LOAD,
    load: load
  }
}

export function updateCPUInfo(info: Systeminformation.CpuWithFlagsData): UpdateCPUInfo {
  return {
    type: UPDATE_CPU_INFO,
    info: info
  }
}

export function requestCPULoad(): RequestCPULoadAction {
  return async (dispatch) => {
    const load = await currentLoad();
    dispatch(updateCPULoad(load));
  }
}

export function requestCPUInfo(): RequestCPUInfoAction {
  return async (dispatch) => {
    const [info, flags] = await Promise.all([cpu(), cpuFlags()]);
    dispatch(updateCPUInfo({...info, flags: flags}));
  }
}

export function requestCPUCurrentSpeed(): RequestCPUCurrentSpeedAction {
  return async (dispatch) => {
    const speed = await cpuCurrentspeed();
    dispatch(updateCPUCurrentSpeed(speed.avg));
  }
}
