import { cpu, memLayout } from "systeminformation";

export function requestStaticInfo() {
  return async (dispatch) => {
    const [cpuInfo, memInfo] = await Promise.all([cpu(), memLayout()]);
    dispatch(updateStaticInfo({
      cpu: cpuInfo,
      mem: memInfo
    }));
  }
}