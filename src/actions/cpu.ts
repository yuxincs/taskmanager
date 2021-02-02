import {Systeminformation} from "systeminformation";

interface UpdateCPUCurrentSpeedAction {
  type: 'UPDATE_CPU_CURRENT_SPEED',
  speed: number
}

interface UpdateCPULoadAction {
  type: 'UPDATE_CPU_LOAD',
  load: Systeminformation.CurrentLoadData
}

interface UpdateCPUInfo {
  type: 'UPDATE_CPU_INFO',
  info: Systeminformation.CpuData
}

export type CPUActions = UpdateCPUCurrentSpeedAction | UpdateCPULoadAction | UpdateCPUInfo;

export function updateCPUCurrentSpeed(speed: number): UpdateCPUCurrentSpeedAction {
  return {
    type: 'UPDATE_CPU_CURRENT_SPEED',
    speed: speed
  }
}

export function updateCPULoad(load: Systeminformation.CurrentLoadData): UpdateCPULoadAction {
  return {
    type: 'UPDATE_CPU_LOAD',
    load: load
  }
}

export function updateCPUInfo(info: Systeminformation.CpuData): UpdateCPUInfo {
  return {
    type: 'UPDATE_CPU_INFO',
    info: info
  }
}
