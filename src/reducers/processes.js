import { UPDATE_PROCESS_INFO } from "../constants/action-types";

let initialState = {
  processes: []
};

export default function processes(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PROCESS_INFO: {
      return Object.assign({}, state, {
        processes: action.processes
      });
    }
  }
  return state;
}