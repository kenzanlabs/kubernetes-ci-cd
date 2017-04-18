import * as types from '../actions/actionTypes';

const initialState = {
  connected: false,
  pods: [],
  activePod: undefined
};

export default function websocketReducer (state = initialState, action) {
  switch (action.type) {
    case types.websocket.CONNECT_TO_SOCKET: {
      return Object.assign({}, state, {
        connected: true
      });
    }
    case types.websocket.DISCONNECT_FROM_SOCKET: {
      return Object.assign({}, state, {
        connected: false
      });
    }
    case types.websocket.GET_PODS: {
      return Object.assign({}, state, { pods: action.pods });
    }
    case types.websocket.POD_UP: {
      if (state.pods.includes(action.pod)) {
        return state;
      } else {
        const pods = [...state.pods, action.pod];
        return Object.assign({}, state, { pods });
      }
    }
    case types.websocket.POD_DOWN: {
      const pods = state.pods.filter(pod => (
        pod !== action.pod
      ));
      return Object.assign({}, state, { pods });
    }
    case types.websocket.ACTIVE_INSTANCE: {
      return Object.assign({}, state, { activePod: action.activeInstance });
    }
    case types.websocket.SCALE: {
      return state;
    }
    default: {
      return state;
    }
  }
}
