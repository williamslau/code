import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { createStore } from '../redux';
// 创建方法
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
// 创建规则
let initState = { number: 0 }
function reducer(state = initState, action) {
    switch (action.type) {
        case INCREMENT:
            return { number: state.number + action.count }
        case DECREMENT:
            return { number: state.number - action.count }
        default:
            return state;
    }
}
// 创建容器
let store = createStore(reducer);
let actions = {
    add(count) {
        return { type: INCREMENT, count: count }
    },
    minus(count) {
        return { type: DECREMENT, count: count }
    }
}
// 一个项目里，一般会有一个store的文件夹，专门管理redux的
// actions      专门放actionCreate
// reducers     专门放reducer
// atcion-types 专门放常量
export default class Counter extends Component {
    constructor() {
        super()
        this.state = { number: store.getState().number }
    }
    handleIncrement = () => {
        store.dispatch(actions.add(2));
    }                
    handleDecrement = () => {
        store.dispatch(actions.minus(1));
    }
    componentDidMount() {
        // 组件挂载完成后，订阅一个更新状态的方法，只要状态发生变化，就更新视图
        store.subscribe(() => {
            this.setState({ number: store.getState().number })
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