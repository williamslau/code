import * as types from '../action-types';
let initState = {
    number: 0
}
function counter(state = initState, action) {
    switch (action.type) {
        case types.INCREMENT:
            return { number: state.number + action.count };
        case types.DECREMENT:
            return { number: state.number - action.count };
    }
    return state;
}
export default counter;