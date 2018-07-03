// { Provider, connect }
// proivder是一个组件,组件里接收一个store属性
// connect是个函数，能调两次，是个高阶函数 函数执行返回的还是一个组件
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
// Provider 有一个属性 是store
let Context = React.createContext();
class Provider extends Component {
    render() {
        // 返回所有的儿子再渲染一遍
        return <Context.Provider value={this.props.store}>
            {this.props.children}
        </Context.Provider>;
    }
}
// 最后connect返回的组件一定是Provider的子组件，使用上下文传递（Context）
let connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
    return class Proxy extends Component {
        // 可以算出一些属性，传递给component
        render() {
            return <Context.Consumer>
                {(store) => {
                    // 不能调用setState()就不能更新视图
                    // let state = mapStateToProps(store.getState());
                    // let actions = mapDispatchToProps(store.dispatch);
                    // // 状态变化后需要更新视图 this.setState()

                    // return <Component {...state} {...actions}></Component>
                    // 外面包一层组件 这样就会有
                    // componentDidMount生命周期
                    // setState();
                    class Hige extends Component {
                        constructor() {
                            super();
                            this.state = mapStateToProps(store.getState());
                            this.old = store.getState();
                        }
                        componentDidMount() {
                            this.unsub = store.subscribe(() => {       // 订阅更新状态的方法
                                if (this.old == store.getState()) return;
                                this.old = store.getState();
                                this.setState(mapStateToProps(store.getState()));
                            });
                        }
                        componentWillUNmount() {
                            this.unsub();
                        }
                        render() {
                            let actions;
                            // 判断mapDispatchTOProps 是不是函数，不是就用bindActionCreators转化一下
                            if (typeof mapDispatchToProps == 'function') {
                                actions = mapDispatchToProps(store.dispatch);
                            } else {
                                actions = bindActionCreators(mapDispatchToProps,store.dispatch)
                            }
                            return <Component {...this.state} {...actions}></Component>
                        }
                    }
                    return <Hige></Hige>
                }}
            </Context.Consumer>
        }
    }
}
export { Provider, connect }


