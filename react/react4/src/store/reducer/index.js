import { combineReducers } from 'redux-immutable';
import counter from './counter';
let state = combineReducers({
    counter
})
export default state;