import React from 'react';
import { render } from 'react-dom';

// jsx语法 javascript和xml语法的集合体
// jsx语法是facebook自己发明的 babel-preset-react
let ele = (
    <h1 className="red">
        <span>zfpx</span>
        hello,world
    </h1>
);
// bable编译后console出来
// console.log(React.createElement(
//     "h1",
//     { className: "red" },
//     "hello,world"
// ));
// 运行结果
// let obj = {
//     type:'h1',
//     props:{
//         className:'red',
//         children:[
//             {
//                  type:'span',
//                  props:{children:'aaa'}
//             },
//             'hello world'
//         ]
//     }
// }
// 先将jsx语法转化成 createElement格式 -> 转化成对象 -> render方法渲染
render(ele,document.getElementById('root'));

// 实现一下