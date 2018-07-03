// import { combineReducers } from 'redux';

// 配合immutable使用，会将对象转化为immutable对象
import { combineReducers } from 'redux-immutable';
import counter from './counter';
export default combineReducers({
    counter
});