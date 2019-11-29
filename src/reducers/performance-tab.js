import { UPDATE_PROCESS_INFO } from "../constants/action-types";

let initialState = {

};

export default function performanceTab(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PROCESS_INFO: {
      return state;
    }
    default:
      return state;
  }
}