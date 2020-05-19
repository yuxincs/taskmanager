import {GeneralActions} from "../actions/general";

interface GeneralState {
  uptime: number
}

let initialState: GeneralState = {
  uptime: 0
};

export default function general(state = initialState, action: GeneralActions) {
  switch(action.type) {
    case 'UPDATE_UPTIME': {
      return {
        ...state,
        uptime: action.uptime
      }
    }
    default:
      return state;
  }
}