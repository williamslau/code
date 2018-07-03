// let 新组件 = connect()(旧的组件)
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
let hign = (key) => (Component) => {
    return class HighOrderComponent extends Component {
        constructor() {
            super();
            this.state = { value: '' };
        }
        componentWillMount() {
            let value = localStorage.getItem(key);
            this.setState({ value: value });
        }
        render(){
            return <Component value={this.state.value}></Component>
        }
    }
}
export default hign;