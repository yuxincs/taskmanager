interface UpdateUpTime {
  type: 'UPDATE_UPTIME',
  uptime: number
}

export type GeneralActions = UpdateUpTime;

export function UpdateUpTime(uptime: number): UpdateUpTime {
  return {
    type: 'UPDATE_UPTIME',
    uptime: uptime
  }
}