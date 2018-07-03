// redux
// 这套逻辑不是可以只用在react里的，单独也可以使用，不想vuex只能配合vue
function createStore(reducer) {
    let state;
    let listeners = [];
    function dispatch(action) {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    }
    let subscribe = (fn) => {
        listeners.push(fn);
        return () => {
            listeners = listeners.filter(listener => fn !== listener);
        }
    }
    dispatch({});
    let getState = () => state;
    return { getState, subscribe, dispatch }
}

// 转变成{counter:{number:0},todos:[]}
// 合并reducer 把他们合并成一个
// key是新状态的命名空间，值是reducer，执行后会返回一个新的reducer
function combineReducers(reducers) {
    // 第二次调用reducer 内部会自动吧第一次的状态传递给reducer
    return (state = {}, action) => {
        // reducer默认要返回一个状态，要获取counter和todo的初始值
        let newState = {};
        for (let key in reducers) {
            // 默认reducer两个参数，state,action
            // 第一次取值state肯定是undefined,会执行内部dispatch({});action就会是{}
            let s = reducers[key](state[key], action);
            newState[key] = s;
        }
        return newState
    }
}
export { createStore, combineReducers }
