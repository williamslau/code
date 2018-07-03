function diff(oldTree, newTree) {
    let patches = {};
    let index = 0;
    walk(oldTree, newTree, index, patches);

    return patches;
}
function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    // 判断老的属性和新的属性的关系
    for (let key in oldAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key];  // 有可能是undefined
        }
    }
    for (let key in newAttrs) {
        if (oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}
const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
let Index = 0;
function diffChildren(oldChildren, newChildren, index, patches) {
    // 比较老的第一个和新的第一个
    oldChildren.forEach((child, idx) => {
        walk(child, newChildren[idx], ++Index, patches)
    })
}
function isString(node) {
    // 没有判断数字
    return Object.prototype.toString.call(node) === '[object String]';
}
function walk(oldNode, newNode, index, patches) {
    let currentPatch = [];  //每个元素都有一个补丁对象
    if (!newNode) {
        currentPatch.push({ type: REMOVE, index });
    } else if (isString(oldNode) && isString(newNode)) { // 判断文本是否一致
        if (oldNode !== newNode) {
            currentPatch.push({ type: TEXT, text: newNode });
        }
    } else if (oldNode.type === newNode.type) {
        // 比较属性是否有更改
        let attrs = diffAttr(oldNode.props, newNode.props);
        if (Object.keys(attrs).length > 0) {
            currentPatch.push({ type: ATTRS, attrs });
        }
        // 如果有儿子节点 遍历儿子
        diffChildren(oldNode.children, newNode.children, index, patches);
    } else {
        currentPatch.push({ type: REPLACE, newNode });
    }
    if (currentPatch.length > 0) {
        // 当前补丁包确实有补丁，将元素放到打补丁中
        patches[index] = currentPatch;
    }
}
export default diff;

// 规则，当节点类型相同时，去看看属性是否相同
// 产生一个属性的补丁包{type:'ATTRE',attre:{class:'list-group'}}
// 新的dom节点不存在