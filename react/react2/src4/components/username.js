import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import high from './high';

class Username extends Component {
    render() {
        return (<div>
            <input type="username" value={this.props.value} onChange={() => { }} />
        </div>)
    }
}
export default high('username')(Username);