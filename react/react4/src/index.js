import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store'
import Counter from './components/Counter'
render(
    <Provider store={store}>
        <Counter/>
    </Provider>,
    window.root);