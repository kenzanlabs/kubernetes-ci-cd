import { combineReducers } from 'redux';
import puzzle from './puzzleReducer';
import webSocket from './websocketReducer';

const rootReducer = combineReducers({
  puzzle,
  webSocket
});
export default rootReducer;
