import { mem, memLayout } from "systeminformation";
import { UPDATE_MEMORY_INFO, UPDATE_MEMORY_LOAD } from "../constants/action-types";

export function requestMemoryLoad() {
  return async (dispatch) => {
    const load = await mem();
    dispatch(updateMemoryLoad(load));
  }
}

export function requestMemoryInfo(info) {
  return async (dispatch) => {
    const info = await memLayout();
    dispatch(updateMemoryInfo(info));
  }
}

export function updateMemoryInfo(info) {
  return {
    type: UPDATE_MEMORY_INFO,
    info: info
  }
}

export function updateMemoryLoad(load) {
  return {
    type: UPDATE_MEMORY_LOAD,
    load: load
  }
}
