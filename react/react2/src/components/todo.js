import React, { Component } from 'react';
import store from '../store'
import actions from '../store/actions/todo'

export default class Todo extends Component {
    constructor() {
        super();
        this.state = { todo: store.getState().t.todos }
    }
    handleDown = (e) => {
        if (e.keyCode === 13) {
            store.dispatch(actions.addTodo(e.target.value));
        }
    }
    componentDidMount() {
        this.unsub = store.subscribe(() => {
            this.setState({ todo: store.getState().t.todos })
        });
    }
    componentWillUnmount() {
        this.unsub();
    }
    render() {
        return (<div>
            <input type="text" onKeyDown={this.handleDown} />
            <ul>
                {this.state.todo.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>)
    }
}