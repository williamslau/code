import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
// 我们的组件要继承react组件，因为react组件封装了很多方法
class Clock extends Component {
    constructor(props) {
        super();
        this.state = { date: new Date().toLocaleString(), name: props.name }
        this.handleClick = this.handleClick.bind(this)
    }
    // state = {date:new Date().toLocaleString(),name:'zfpx'}
    // 如果用类组件需要提供一个render方法
    // 组件渲染完成后会调用这个生命周期componentDidMount
    // this.setState不会覆盖其他的值，只会合并修改的值

    componentWillUnmount() {     // 组件将要被卸载
        clearInterval(this.timer);
    }
    componentDidMount() {
        // this.setState()     // react提供的，继承来的
        this.timer = setInterval(() => {
            // 更新页面
            this.setState({ date: new Date().toLocaleString() })
        }, 1000);
    }
    // 绑定方法有几种方式 方法中可能会有this
    // 1.箭头函数 onClick={()=>{ this.handleClick() }
    // 2.onClick={this.handleClick.bind(this) }
    // 以上两种每次点击都产生一个新函数
    // 3.在构造函数(constructor)绑定this
    // 4.es7语法，完美解决this指向 handleClick=() => {}
    handleClick = () => {
        ReactDOM.unmountComponentAtNode(document.querySelector('#root'));   // 卸载组件
    }
    // handleClick() {
    //     console.log(this);
    // }
    render() {
        return (
            <div onClick={this.handleClick}>
                <span>当前时间：</span>
                {this.state.date}<br />
                {this.state.name}
            </div>
        )
    }
}

render(
    <React.Fragment>
        <Clock name='aaa' />
        <Clock name='bbb' />
    </React.Fragment>,
    window.root
)

// 组件有两个数据源，一个是属性 外界传递的，还有一个是状态，是自己的
// 你传递的组件可能不是我预期的
// 什么时候放在this上，什么时候放在this.state上
// 需要变化的数据放在this.state上