import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions/counter';

class Counter extends Component {
    constructor() {
        super();
    }
    handleAdd = () => {
        this.props.add(2);
    }
    handleMinus = () => {
        this.props.minus(1);
    }
    render() {
        return (<div>
            计数器{this.props.n}
            <button onClick={this.handleAdd}>+</button>
            <button onClick={this.handleMinus}>-</button>
        </div>)
    }
}
export default connect(state => {
    return ({ n: state.counter.number })
}, actions)(Counter);

// export default connect(state => ({ n: state.counter.number }),
//     dispatch => ({
//         add:(count)=>dispatch(actions.add(count)),
//         minus:(count)=>dispatch(actions.minus(count)),
//     })
// )(Counter);

// 为什么可以直接写actions
// 这个方法是redux中的方法
// function binActionCreators(actions, dispatch) {
//     let obj = {};
//     for (let key in actions) {
//         // 给对象增加一个属性 key 是actions中的key，值是函数，函数中的内容就是派发一个动作
//         obj[key] = (...args) => dispatch(actions[key](...args));
//     }
//     return obj;
// }
// export default connect(state => ({ n: state.counter.number }),
//     dispatch => binActionCreators(actions, dispatch)
// )(Counter);