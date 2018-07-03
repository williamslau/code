import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
// 生命周期执行时是异步的
class LifeCyele extends Component {
    static defaultProps = {       // 默认属性
        name: 'william'
    }
    constructor(props) {
        super();
        this.state = { name: props.name, count: 0 }   // 默认属性

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
    componentDidMount() {    // 组件挂载完成
        console.log('father:componentDidMount');
    }
    shouldComponentUpdate(nextProps, nextStare) {    // 如果没有写这个生命周期，默认return true
        if (nextStare.count === this.state.count) {
            return false;
        }
        return true
    }
    componentDidUpdate() {       // 组件更新完成
        console.log('father:componentDidUpdate');
    }
};
class Child extends Component{
    constructor(){
        super();
        this.state = {}
    }
    render(){
        console.log('child:render');
        return (<div>{this.props.count}//{this.state.a}</div>)
    }
    
    static getDerivedStateFromProps(){  // 代替componentWillReceiveProps 这个方法没有this了 16.3新增
        console.log('receiveProps');
        return {a:1000};    // 会返回到constructor.state中，返回的结果会作为状态
    }
    getSnapshotBeforeUpdate(){      // 代替componentWillUpdate 得到更新前的快照，一般用不到 16.3更新 将要更新
        console.log('getSnapshotBeforeUpdate');
        return {a:1}                // 会成为componentDidMount的第三个参数
    }
    componentDidUpdate(prevProps,prevState,obj){
        console.log(obj);
        console.log('child:componentDidMount'); //更新完成
    }
    // componentDidCatch  捕获异常
}
render(<LifeCyele></LifeCyele>, window.root);