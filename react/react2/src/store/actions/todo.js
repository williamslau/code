import * as types from '../action-types'
console.log(types);
let actions = {
    addTodo(todo) {
        return { type: types.ADD_TODO, todo:todo }
    }
}
export default actions;