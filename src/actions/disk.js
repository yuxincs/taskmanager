import { disksIO } from "systeminformation";
import { updateDiskInfo } from "./memory";

export function requestDiskInfo() {
  return async (dispatch) => {
    const disk = await disksIO();
    dispatch(updateDiskInfo(disk));
  }
}