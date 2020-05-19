import {Systeminformation} from "systeminformation";

interface UpdateMemoryInfo {
  type: 'UPDATE_MEMORY_INFO',
  info: Systeminformation.MemLayoutData[]
}

interface UpdateMemoryLoad {
  type: 'UPDATE_MEMORY_LOAD',
  load: Systeminformation.MemData
}

export type MemoryActions = UpdateMemoryInfo | UpdateMemoryLoad;

export function updateMemoryInfo(info: Systeminformation.MemLayoutData[]): UpdateMemoryInfo {
  return {
    type: 'UPDATE_MEMORY_INFO',
    info: info
  }
}

export function updateMemoryLoad(load: Systeminformation.MemData): UpdateMemoryLoad {
  return {
    type: 'UPDATE_MEMORY_LOAD',
    load: load
  }
}
