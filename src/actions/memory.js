import {UPDATE_DISK_INFO, UPDATE_STATIC_INFO} from "../constants/action-types";

export function updateStaticInfo(staticInfo) {
  return {
    type: UPDATE_STATIC_INFO,
    staticInfo: staticInfo
  }
}

export function updateDiskInfo(diskInfo) {
  return {
    type: UPDATE_DISK_INFO,
    diskInfo: diskInfo
  }
}