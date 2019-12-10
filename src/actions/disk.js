import { disksIO } from "systeminformation";
import { UPDATE_DISK_LOAD } from "../constants/action-types";

export function requestDiskLoad() {
  return async (dispatch) => {
    const load = await disksIO();
    dispatch(updateDiskLoad(load));
  }
}

export function updateDiskLoad(load) {
  return {
    type: UPDATE_DISK_LOAD,
    load: load
  }
}