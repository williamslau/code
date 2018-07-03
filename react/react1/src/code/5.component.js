// 组件分两种
// 函数组件
// 类组件
// 函数组件中没有this,没有声明周期，没有状态

import React from 'react';
import { render } from 'react-dom';

// 如果名字是大写，就是组件，小写就是jsx元素
// This usually means a return statement is missing. Or, to render nothing, return null.
// 返回值可以是bull，但不能是undefined
// 组件可以通过属性传递数据

function School(props){
    return <h1>{props.name}{props.age.a}</h1>;
}
render(<School name="william" age={{a:8}}></School>,window.root);