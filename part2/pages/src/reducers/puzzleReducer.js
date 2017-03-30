import * as types from '../actions/actionTypes';

export default function puzzleReducer (state = {}, action) {
  switch (action.type) {
    case types.puzzle.GET_PUZZLE_DATA: {
      return Object.assign({}, state, { puzzleData: action.data });
    }
    default: {
      return state;
    }
  }
}
