



// 安装官方脚手架
// npm install create-react-app -g
// create-react-app project-filename
// cd project-filename
// npm start

// react和vue的区别
// react基于jsx语法（js/xml）facebook出的大型项目react更加适合
// vue基于模板               阿里出的




// 设置class用className=""
// let ele = <h1 className="red">hello,wold</h1>
// 以大写字母开头的是自定义组件


// redux 
// store容器，一个应用只有一个，一个应用只有一个状态
// reducer 多个 合并reducer用 combinReducers
// dispatch redux提供的方法
// action 需要有一个type actionCreater

// react-redux
// Provider 提供一个store
// connect 拿到 store store.getStat() store.dispatch

// react打断点
// debugger


// 中间件的用法
// redux-logger         打印日志
// redux-thunk          异步请求
// redux-promise        promise
// 在store 的主文件上，用在createStore上
// import { createStore, applyMiddleware } from 'redux';
// 导出的时候
// export default applyMiddleware(reduxLogger)(createStore)(reducer);
// export default createStore(reducer,applyMiddleware(reduxLogger));

// reduxThunk可以吧派发的权限交给自己
// 没有用redux之前actions里的方法return是对象
// 用了之后返回的是函数
// 函数接收dispatch,getState两个参数，可以自己手动派发（dispatch）
// getState()就是 reducers里的 initState对象。
// console.log(getState().getIn(['counter', 'number']));



