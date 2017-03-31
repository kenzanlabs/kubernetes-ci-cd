import * as actions from './actionTypes';
import toastr from 'toastr';
const baseUrl = `http://${location.hostname}:3000/puzzle/v1`;

export function getPuzzleData () {
  return dispatch => {
    return fetch(`${baseUrl}/crossword`)
      .then((resp) => {
        return resp.json();
      })
      .then((json) => {
        dispatch({type: actions.puzzle.GET_PUZZLE_DATA, data: json});
      });
  };
}

export function submitPuzzleData (id, data) {
  return dispatch => {
    const submission = JSON.stringify(data);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(`${baseUrl}/crossword`, {
      method: 'PUT',
      headers,
      body: submission
    })
      .then((resp) => {
        if (resp.status === 204) {
          toastr.success(`Progress saved!`);
          dispatch({type: actions.puzzle.SUBMIT_PUZZLE_DATA, data});
        } else {
          toastr.error(`We're sorry! Something went wrong on your request.`);
        }
      });
  };
}
