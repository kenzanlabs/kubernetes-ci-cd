import * as actions from './actionTypes';

export function getPuzzleData () {
  return dispatch => {
    return fetch('../../puzzle.json')
      .then((resp) => {
        return resp.json();
      })
      .then((json) => {
        dispatch({type: actions.puzzle.GET_PUZZLE_DATA, data: json});
      });
  };
}
