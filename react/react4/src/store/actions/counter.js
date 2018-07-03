import * as types from '../action-types';
let action = {
    add(count) {
        return { type: types.INCREMENT, count }
    },
    minus(count) {
        return { type: types.DECREMENT, count };
    },
    thunk(count) {
        return function(dispatch,getState){
            setTimeout(function(){
                dispatch({ type: types.INCREMENT, count });
            },1000)
        }
    },
    promise(count){
        return new Promise(function(resolve,reject){
            if(Math.random()>0.5){
                setTimeout(function(){
                    resolve({ type: types.INCREMENT, count });
                },1000);
            }else{
                setTimeout(function(){
                    reject({ type: types.DECREMENT, count });
                },1000);
            }
        });
    },
    promise2(count){
        return {
            type: types.CHANGE,
            payload: new Promise((resolve, reject) => {
                console.log(count);
                reject(count);
            })
        }
    },
}
export default action;