import {UPDATE_STATIC_INFO} from "../constants/action-types";

export function updateStaticInfo(staticInfo) {
  return {
    type: UPDATE_STATIC_INFO,
    staticInfo: staticInfo
  }
}
