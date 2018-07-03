// 评论组件外层的comments是智能组件，可以获取数据传给子组件
// 一条条的评论是木偶组件，自负责展示




import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
class Comments extends Component {
    constructor() {
        super()
        this.state = { comments: [], count: 0 }
    }
    componentWillMount() { }    // WillMount组件将要挂载完 (16.3已经移除)没什么用
    async componentDidMount() {       // DidMount组件已经挂载完
        // 在react中发送ajax请求 fetch比较底层，不推荐
        // axios 封装了RESTFul风格，基于promise,不支持jsonp,可以用在客户端
        let { data: comments } = await axios.get('/user.json');

        this.setState({ comments })
        console.log(this.state.comments);
    }
    handleAdd=(count) => {
        this.setState({count:this.state.count+count});
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    {this.state.comments.map((item, index) => (
                        <List key={index} index={index} {...item} parent={this.handleAdd}></List>
                    ))}
                    <Total count={this.state.count}></Total>
                </div>
            </React.Fragment>
        )
    }
}
class Total extends Component{
    render(){
        return <div className="h2">总数量：{this.props.count}</div>
    }
}
class List extends Component {
    handleClick= ()=>{
        this.props.parent(2);
    }
    render() {
        let { avatar, username, content } = this.props;
        return <div className="media">
            <div className="media-head">
                <img src={avatar} style={{ width: '64px' }} />
            </div>
            <div className="media-body">
                <h3 className="h3">{username}</h3>
                <p>{content}</p>
                <button className="btn btn-danger" onClick={this.handleClick}>喜欢</button>
            </div>
        </div>
    }
}
// 组件间的通信
// 1.通过属性传递，这种方式只能父传子，子组件不能传给父组件 单项数据流，数据的方向是单项的
// 2.父亲写好一个方法传递给儿子，儿子调用这个方法，相当于调用了父类的方法，这个方法可以去更改数据
// 3.同级数据传递，同级组件想要传递数据，可以找到共同的父级，没有父级，就创造父级
render(<Comments></Comments>, window.root)
