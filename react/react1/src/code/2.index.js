
class Element {
    constructor(type, props) {
        this.type = type;
        this.props = props;

    }
}


let React = {
    createElement(type, props, ...children) {
        if (children.length === 1) children = children[0];
        return new Element(type, { ...props, children });
    }
}
let ele = React.createElement(
    "h1",
    { className: "red" },
    React.createElement(
        "h1",
        { className: "red" },
        "hello,world"
    ),
    "hello,world"
);
console.log(ele);
function render(eleObj, container) {
    let { type, props } = eleObj;
    let ele = document.createElement(type);
    for (let key in props) {
        if (key !== 'children') {
            if (key === 'className') {
                ele.setAttribute('class', props[key]);
            }else{
                ele.setAttribute(key, props[key]);
            }
        } else {
            // 子节点
            let children=props[key];
            if(Array.isArray(children)){
                // 是数组
                children.forEach(child =>{
                    console.log(child);
                    if(child instanceof Element){
                        // 递归
                        render(child,ele);
                    }else{
                        ele.appendChild(document.createTextNode(child));
                    }
                });
            }else{
                if(children instanceof Element){
                    // 递归
                    render(children,ele);
                }else{
                    ele.appendChild(document.createTextNode(children));
                }
            }
            
        }
    }
    container.appendChild(ele);
}
render(ele, window.root);