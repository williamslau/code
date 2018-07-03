import * as types from '../action-types';
import { fromJS } from 'immutable';
let initState = fromJS({ number: 0 });
function counter(state = initState, action) {
    switch (action.type) {
        case types.INCREMENT:
            return state.update('number', value => (value + action.count))
        // return { number: state.number + action.count };
        case types.DECREMENT:
            return state.update('number', value => (value - action.count))
    }
    return state;
}
export default counter;