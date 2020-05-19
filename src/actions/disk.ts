import {Systeminformation} from "systeminformation";

interface UpdateDiskLoad {
  type: 'UPDATE_DISK_LOAD',
  load: Systeminformation.DisksIoData
}

export type DiskActions = UpdateDiskLoad;

export function updateDiskLoad(load: Systeminformation.DisksIoData): UpdateDiskLoad {
  return {
    type: 'UPDATE_DISK_LOAD',
    load: load
  }
}