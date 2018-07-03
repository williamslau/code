import { createStore,combineReducers } from '../redux';
// import { createStore, combineReducers } from 'redux';
import counter from './raducers/counter';    // {number:0}
import todo from './raducers/todo';          // {todos:[]}

let reducer = combineReducers({     // 合并多个reducer
    c: counter,
    t: todo
});
// 创建容器
let store = createStore(reducer);
window.store = store;

export default store;