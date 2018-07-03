// 高阶组件 组件返回组件
// 高阶函数 函数可以接收函数作为参数，函数可以返回函数
// funciton name(params){
//     return function () {

//     }
// }


// 高阶组件的目的就是解决代码的复用，将公共的代码提出来
// 两个输入框，都需要去本地的localStorage中取值
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import Username from './components/username';
import Password from './components/password';

render(<div>
    <Username></Username>
    <Password></Password>
</div>, window.root);