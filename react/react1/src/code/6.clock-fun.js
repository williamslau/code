// 时钟的例子
// 每秒更新一次
// react可以根据更改来渲染部分页面
import React from 'react';
import { render } from 'react-dom';

function Clock(props){
    return (
        <React.Fragment>
            <span>当前时间：</span>
            {props.date.toString()}
        </React.Fragment>
    )
}
render(<Clock date={new Date()}></Clock>,window.root);
setInterval(function(){
    render(<Clock date={new Date()}></Clock>,window.root)
},1000);