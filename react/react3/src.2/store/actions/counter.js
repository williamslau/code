import * as types from '../action-types';
let actions = {
    add(n) {
        return { type: types.INCREMENT, count: n }
    },
    minus(n) {
        return { type: types.DECREMENT, count: n }
    }
}
export default actions;