import { UPDATE_CPU_CURRENT_SPEED, UPDATE_CPU_INFO, UPDATE_CPU_LOAD } from "../constants/action-types";
import {Systeminformation} from "systeminformation";

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

export type CPUActions = UpdateCPUCurrentSpeedAction | UpdateCPULoadAction | UpdateCPUInfo;

export function updateCPUCurrentSpeed(speed: number): UpdateCPUCurrentSpeedAction {
  return {
    type: UPDATE_CPU_CURRENT_SPEED,
    speed: speed
  }
}

export function updateCPULoad(load: Systeminformation.CurrentLoadData): UpdateCPULoadAction {
  return {
    type: UPDATE_CPU_LOAD,
    load: load
  }
}

export function updateCPUInfo(info: Systeminformation.CpuWithFlagsData): UpdateCPUInfo {
  return {
    type: UPDATE_CPU_INFO,
    info: info
  }
}
