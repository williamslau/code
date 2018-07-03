import React, { Component } from 'react';
import actions from '../store/actions/counter';
import { connect } from 'react-redux';
class Counter extends Component {
    constructor() {
        super();
    }
    // componentDidMount() {
    //     // 组件挂载完成后需要订阅一个更新状态的方法
    //     this.unsub = store.subscribe(() => {
    //         this.setState({ number: store.getState().counter.number });
    //     });
    // }
    // componentWillUnmount() {
    //     this.unsub();
    // }
    handleIncrement = () => {
        this.props.add(1);
    }
    handleDecrement = () => {
        this.props.minus(1);
    }
    handleThunk = () => {
        this.props.thunk(2);
    }
    handlePromise = () => {
        this.props.promise(3);
    }
    handlePromise2 = () => {
        this.props.promise2(1);
    }
    render() {
        return (<div>
            计数器{this.props.n}
            <button onClick={this.handleIncrement}>+</button>
            <button onClick={this.handleDecrement}>+</button>
            <button onClick={this.handleThunk}>thunk</button>
            <button onClick={this.handlePromise}>promise</button>
            <button onClick={this.handlePromise2}>promise2</button>
        </div>)
    }
}
export default connect(
    state => ({ n: state.getIn(['counter', 'number']) }),
    actions
)(Counter);