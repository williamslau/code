import React from 'react';
import { render } from 'react-dom';


// jsx和html的写法不完全一样
// className 他要转化成 class
// htmlFor 他要转化成for属性 label for
// jsx元素可以嵌套
// <React.Fragment></React.Fragment> 包裹多元素
// jsx里面可以放js,{js代码}
// <div dangerouslySetInnerHTML={{__html:'<p>hello</p>'}}></div> 会导致xss攻击
// htmlFor label的用法
let name = 'williamlau';
let age = 9;
let ele = (
    <React.Fragment>
        <label htmlFor="a">输入焦点</label>
        <input type="text" id="a"/>
        <div className="aaa">{name}<br/>{age}</div>
        <div>{function(){
            /* 注释 */
            return 1000
        }()}</div>
        {1+2}<br/>
        {1===1?'2':'3'}
        <div style={{background:'red'}}>111</div>
        <div dangerouslySetInnerHTML={{__html:'<p>hello11</p>'}}></div>
    </React.Fragment>
);
render(ele, window.root);