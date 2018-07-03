import * as types from '../action-types';
let actions = {
    add(n) {
        // return { type: types.INCREMENT, count: n }
        return (dispatch, getState) => {
            console.log(getState().getIn(['counter', 'number']));
            setTimeout(() => {
                dispatch({ type: types.INCREMENT, count: n })
            }, 1000);
        }
    },
    minus(n) {
        // return { type: types.DECREMENT, count: n }
        // 只支持成功的返回，不支持reject();
        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve({ type: types.DECREMENT, count: n });
        //     },1000);
        // });
        // 返回对象的方法支持失败的reject()
        return {
            type: types.DECREMENT,
            payload: new Promise((resolve, reject) => {
                reject({ count: n });
            })
        }
    }
}
export default actions;