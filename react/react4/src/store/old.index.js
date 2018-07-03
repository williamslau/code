// import { createStore, applyMiddleware } from 'redux'
import { createStore } from 'redux'
import reducer from './reducer'
// import thunk from 'redux-thunk';
// import logger from 'redux-logger'
// getState 获取仓库中的状态对象
// dispatch 派发的方法

function logger({ dispatch, getState }) {   // 想获取状态和派发动作
    return function (next) {    // 如果像继续，则调用next();
        return function (action) {
            console.log('before state', getState());
            console.log(action);
            next(action);
            console.log('after state', getState());
        }
    }
}
function thunk({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            if (typeof action === 'function') {
                action(dispatch, getState);
            } else {
                next(action);
            }
        }
    }
}
let promise = ({ dispatch, getState }) => next => action => {
    if (action.then && typeof action.then === 'function') {
        action.then(dispatch);
    } else {
        next(action);
    }
}
let promise2 = ({ dispatch, getState }) => next => action => {
    if (action.then && typeof action.then === 'function') {
        action.then(dispatch);
    } else if(action.payload &&
        action.payload.then &&
        typeof action.payload.then === 'function'
    ) {
        
    }else {
        next(action);
    }
}
function applyMiddleware(middleware) {
    return function (createStore) {
        return function (reducer) {
            let store = createStore(reducer);//创建出原生的仓库 getState dispatch
            let dispatch;
            let middlewareAPI = {
                dispatch: action => dispatch(action),
                getState: store.getState,
            };
            middleware = middleware(middlewareAPI);
            dispatch = middleware(store.dispatch);
            return { ...store, dispatch }
        }
    }
}
let store = createStore(reducer);
window.store = store;
let store2 = applyMiddleware(promise2)(createStore)(reducer);
// let store2 = createStore(reducer,applyMiddleware(thunk,logger));
export default store2;
// 中间件的原理就是对原生仓库的dispatch方法的增强或者修改
