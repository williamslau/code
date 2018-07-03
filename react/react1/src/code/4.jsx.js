import React from 'react';
import { render } from 'react-dom';
function school(name,age){
    return <h1>{name}{age}</h1>
}
let el =(
    <div>{school('williamlau',9)}</div>
)
// 数组可以直接渲染到页面上
// 渲染列表要用map
let dinner=['汉堡','可乐','薯条'];
let ele=dinner.map((item,index)=> (
    <li key={index}>{item}</li>
));
render(ele,window.root);


// 组件