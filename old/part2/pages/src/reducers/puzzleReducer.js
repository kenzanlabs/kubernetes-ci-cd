import * as types from '../actions/actionTypes';

const initialState = {
  id: '',
  puzzleData: []
};

export default function puzzleReducer (state = initialState, action) {
  switch (action.type) {
    case types.puzzle.GET_PUZZLE_DATA: {
      return Object.assign({}, state, {
        id: action.data.id,
        puzzleData: action.data.words
      });
    }
    case types.puzzle.SUBMIT_PUZZLE_DATA: {
      return Object.assign({}, state, {
        puzzleData: action.data
      });
    }
    default: {
      return state;
    }
  }
}
