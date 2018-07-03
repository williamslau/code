// 非受控组件
// 1.可以操作DOLM，获取真实DOM
// 2.可以和第三方库结合
// 3.不需要对当前输入的内容进行校验，也不需要默认值
// 有两种写法
// 1.函数的方式
// 2.React.createRef() 16.3以上

import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class App extends Component {
    constructor() {
        super();
        this.text = React.createRef();
    }
    componentDidMount() {
        // this.text.focus();
        this.text.current.focus();
    }
    render() {
        return (<div>
            {/* <input type="text" ref={(input) => { this.text = input }} /> */}
            <input type="text" ref={this.text} />
        </div>)
    }
}

render(<App></App>, window.root)