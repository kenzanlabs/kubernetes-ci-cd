import io from 'socket.io-client';
import constants from '../constants';
import * as types from './actionTypes';

const baseUrl = `http://monitor-scale.${constants.minikubeIp}.xip.io`;
const socket = io(baseUrl);

export function getPods () {
  return dispatch => {
    return fetch(`${baseUrl}/pods`)
      .then(resp => (
        resp.json()
      ))
      .then(json => {
        const pods = json.pods.map(pod => (
          concatServiceName(pod.key)
        ));
        dispatch({type: types.websocket.GET_PODS, pods});
      })
      .catch(err => {
        throw err;
      });
  };
}

export function connectToSocket () {
  return dispatch => {
    socket.open(() => {
      dispatch({type: 'CONNECT_TO_SOCKET'});
    });
    socket.on('pods', (data) => {
      const pod = concatServiceName(data.pods);

      if (data.action === 'set') {
        dispatch({ type: types.websocket.POD_UP, pod });
      } else if (data.action === 'delete') {
        dispatch({ type: types.websocket.POD_DOWN, pod });
      }
    });
    socket.on('hit', (data) => {
      const activeInstance = concatServiceName(data.podId);
      dispatch({ type: types.websocket.ACTIVE_INSTANCE, activeInstance });
    });
  };
}

export function disconnectFromSocket () {
  return dispatch => {
    socket.close(() => {
      dispatch({type: 'DISCONNECT_FROM_SOCKET'});
    });
  };
}

export function scale (data) {
  return dispatch => {
    const submission = JSON.stringify({'count': data});
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(`${baseUrl}/scale`, {
      method: 'POST',
      headers,
      body: submission
    });
  };
}

export function submitConcurrentRequests (count) {
  return dispatch => {
    const submission = JSON.stringify({'count': count});
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(`${baseUrl}/loadtest/concurrent`, {
      method: 'POST',
      headers,
      body: submission
    })
    .catch(err => {
      throw (err);
    });
  };
}

export function submitConsecutiveRequests (count) {
  return dispatch => {
    const submission = JSON.stringify({'count': count});
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(`${baseUrl}/loadtest/consecutive`, {
      method: 'POST',
      headers,
      body: submission
    })
    .catch(err => {
      throw (err);
    });
  };
}

function concatServiceName (name) {
  const parts = name.split('/');
  const serviceName = parts[parts.length - 1];
  return serviceName;
}
