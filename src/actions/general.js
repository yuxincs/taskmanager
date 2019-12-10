import { time } from "systeminformation";
import { UPDATE_GENERAL_INFO } from "../constants/action-types";

export function requestGeneralInfo() {
  return async (dispatch) => {
    const curTime = await time();
    const general = {
      uptime: curTime.uptime
    };
    dispatch(updateGeneralInfo(general));
  }
}

export function updateGeneralInfo(info) {
  return {
    type: UPDATE_GENERAL_INFO,
    ...info
  }
}