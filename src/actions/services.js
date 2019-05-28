import { processes } from 'systeminformation';
import { UPDATE_PROCESS_INFO } from '../constants/action-types';

export function updateProcessInfo(processInfo) {
  return {
    type: UPDATE_PROCESS_INFO,
    processes: processInfo
  }
}

export function requestProcessInfo() {
  return (dispatch) => {
    processes()
      .then(data => {
        dispatch(updateProcessInfo(data));
      })
      .catch(error => console.error(error));
  }
}