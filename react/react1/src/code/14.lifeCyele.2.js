import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
// 生命周期执行时是异步的
class LifeCyele extends Component {
    static defaultProps = {       // 默认属性
        name: 'william'
    }
    constructor(props) {
        super();
        console.log('father:constructor');
        this.state = { name: props.name, count: 0 }   // 默认属性

    }
    componentWillMount() {  // 组件将要挂载，不推荐数用
        console.log('father:componentWillMount');
    }
    componentDidMount() {    // 组件挂载完成
        console.log('father:componentDidMount');
    }
    handleClick = () => {
        this.setState({ count: this.state.count + 1 });
    }
    render() {              // 渲染
        console.log('father:render');
        return (<div>
            计数器：{this.state.count}
            <button onClick={this.handleClick}>+</button>
            <Child count={this.state.count}></Child>
        </div>)
    }
    shouldComponentUpdate(nextProps, nextStare) {    // 如果没有写这个生命周期，默认return true
        if (nextStare.count === this.state.count) {
            return false;
        }
        return true
    }
    componentWillUpdate() {      // 组件将要更新 这个方法没什么用16.3被删除，给了个新方法
        console.log('father:componentWillUpdate');

    }
    componentDidUpdate() {       // 组件更新完成
        console.log('father:componentDidUpdate');
    }
};
class Child extends Component{
    componentWillMount(){
        console.log('child:componentWillMount');
    }
    render(){
        console.log('child:render');
        return (<div>{this.props.count}</div>)
    }
    // shouldComponentUpdate(nextProps,nextState){
    //     return true;
    // }
    componentDidMount(){
        console.log('child:componentDidMount');
    }
    // 此方法中可以调用setState方法进行更新
    componentWillReceiveProps(newProps) { // 后期16.3中也更新了
        console.log('child:ReceiveProps')
    }
}
render(<LifeCyele></LifeCyele>, window.root);