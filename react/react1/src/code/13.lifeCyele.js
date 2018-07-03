import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
// 生命周期执行时是异步的
class LifeCyele extends Component {
    static defaultProps = {       // 默认属性
        name: 'william'
    }
    constructor(props) {
        super();
        console.log('constructor');
        this.start = { name: props.name }   // 默认属性

    }
    componentWillMount() {  // 组件将要挂载，不推荐数用
        console.log('componentWillMount');
    }
    componentDidMount(){    // 组件挂载完成
        console.log('componentDidMount');
    }
    render() {              // 渲染
        console.log('render');
        return (<div>
            {this.props.name}
            {this.start.name}
        </div>)
    }
}
render(<LifeCyele></LifeCyele>, window.root)