import * as types from '../action-types';
import { fromJS } from 'immutable';
// let initState = { number: 0 };
let initState = fromJS({ number: 0 });
function reducer(state = initState, action) {
    switch (action.type) {
        case types.INCREMENT:
            // return { number: state.number + action.count }
            return state.update('number', value =>(value+action.count));
        case types.DECREMENT:
            // return { number: state.number - action.count }
            return state.update('number', value =>(value-action.count));
        case types.CHANGE:
            // return { number: state.number - action.count }
            return state.update('number', value =>(value+action.payload));
    }
    return state;
}
export default reducer;