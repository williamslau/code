// 受控组件 非受控组件 针对的是状态（state）
// 指的都是表单元素
// form可以校验表单
// 不让表单刷新可以将onSubmit preventDefault()掉 react包装好的
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class App extends Component {
    constructor() {
        super();
        this.state = { content: 'hello',a:1,b:2 }
    }
    handleSubmit = (e) => {
        e.preventDefault(); // 指的就是提交表单事件
    }
    handleChange = (e) => {
        let name=e.target.name;
        this.setState({[name]:e.target.value});
    }
    render() {              // required={true} 设置表单必填
        // value={this.state.content}绑定数据
        // defaultValue={this.state.content}绑定默认值，但是不是双向绑定
        // 双向数据绑定：react默认先将状态绑定到视图上，状态不变，视图就不会刷新
        // 要改变数据要绑定change方法,name为数据名
        // 这就是受控组件，受控组件可以对输入的数据进行监控，可以控制数据的输入的过程，进行默认值操作
        return (<form onSubmit={this.handleSubmit}>
            <input
                type="text"
                required={true}
                value={this.state.a}
                onChange={this.handleChange}
                name="a"
            />
            {this.state.a}
            <input
                type="text"
                required={true}
                value={this.state.b}
                onChange={this.handleChange}
                name="b"
            />
            {this.state.b}
            <input type="submit" />
        </form>)
    }
}




render(<App></App>, window.root)