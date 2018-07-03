import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import store from '../store';
import actions from '../store/actions/counter'

export default class Counter extends Component {
    constructor() {
        super()
        this.state = { number: store.getState().c.number }
    }
    handleIncrement = () => {
        store.dispatch(actions.add(2));
    }
    handleDecrement = () => {
        store.dispatch(actions.minus(1));
    }
    componentDidMount() {
        // 组件挂载完成后，订阅一个更新状态的方法，只要状态发生变化，就更新视图
        this.unsub = store.subscribe(() => {
            this.setState({ number: store.getState().c.number })
        });
    }
    componentWillUnmount() { // 组建移除时（组件将要移除时）
        // 移除订阅
        this.unsub();
    }
    render() {
        return (<div>
            计数器{this.state.number}
            <button onClick={this.handleIncrement}>+</button>
            <button onClick={this.handleDecrement}>-</button>
        </div>)
    }
}