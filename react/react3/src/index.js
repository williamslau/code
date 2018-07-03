import React from 'react';
import { render } from 'react-dom';
import Counter from './components/counter';
import { Provider } from './react-redux';
import store from './store'
render(<Provider store={store}>
    <React.Fragment>
        <Counter></Counter>
    </React.Fragment>
</Provider>, window.root);