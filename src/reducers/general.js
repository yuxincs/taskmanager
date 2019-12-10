import { UPDATE_GENERAL_INFO } from "../constants/action-types";

let initialState = {
  uptime: 0
};

export default function general(state = initialState, action) {
  switch(action.type) {
    case UPDATE_GENERAL_INFO: {
      return Object.assign({}, state, {
        uptime: action.uptime
      });
    }
    default:
      return state;
  }
}