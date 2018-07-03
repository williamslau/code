// 计数器 
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import Counter from './components/counter'
import Todo from './components/todo'

// render(<Counter></Counter>, window.root)
render(<div>
    <Counter></Counter>
    <Todo></Todo>
</div>, window.root);