// import { createStore, applyMiddleware } from 'redux'
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import promise from 'redux-promise'
// getState 获取仓库中的状态对象
// dispatch 派发的方法

// function logger({ dispatch, getState }) {   // 想获取状态和派发动作
//     return function (next) {    // 如果像继续，则调用next();
//         return function (action) {
//             console.log('before state', getState());
//             console.log(action);
//             next(action);
//             console.log('after state', getState());
//         }
//     }
// }
// function thunk({ dispatch, getState }) {
//     return function (next) {
//         return function (action) {
//             if (typeof action === 'function') {
//                 action(dispatch, getState);
//             } else {
//                 next(action);
//             }
//         }
//     }
// }
// let promise = ({ dispatch, getState }) => next => action => {
//     if (action.then && typeof action.then === 'function') {
//         action.then(dispatch);
//     } else if (action.payload &&
//         action.payload.then &&
//         typeof action.payload.then === 'function'
//     ) {
//         action.payload.then(function (payload) {
//             dispatch({ ...action, payload });
//         }, function (payload) {
//             dispatch({ ...action, payload });
//         });
//     } else {
//         next(action);
//     }
// }
// 函数化编程 纯函数 输入一样，输出也一定一样，不能产生外部能察觉的变化，就不不要改变所传入的参数值
// let compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)));
// let applyMiddleware = (...middlewares) => createStore => reducer => {
//     let store = createStore(reducer);
//     let dispatch;
//     let middlewareAPI = {
//         // 此处不要简化为dispatch,因为我们希望让middlewareAPI,dispatch调用增强后的dispath
//         dispatch: action => dispatch(action),
//         getState: store.getState
//     }
//     middlewares = middlewares.map(middleware => middleware(middlewareAPI))
//     // 把多个中间件组合成一个函数，接收一个参数，病获取一个返回值
//     dispatch = compose(...middlewares)(store.dispatch);
//     return { ...store, dispatch }
// }
// function createStore(reducer, enhancer) {
//     if (typeof enhancer === 'function') {
//         return enhancer(createStore)(reducer);
//     }
// }
let store = createStore(reducer);
window.store = store;
// let store2 = applyMiddleware(thunk, promise, logger)(createStore)(reducer);
let store2 = createStore(reducer, applyMiddleware(thunk, promise, logger));
export default store2;
// 中间件的原理就是对原生仓库的dispatch方法的增强或者修改
