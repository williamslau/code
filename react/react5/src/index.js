import { createElement, render, renderDom } from './element';
import diff from './diff';
import patch from './patch';
let vertualDom = createElement('ul', { class: 'list' }, [
    createElement('li', { class: 'item' }, ['a']),
    createElement('li', { class: 'item' }, ['3']),
    createElement('li', { class: 'item' }, ['5'])
]);

let vertualDom2 = createElement('ul', { class: 'list-group' }, [
    createElement('li', { class: 'item' }, ['0']),
    createElement('li', { class: 'item' }, ['3']),
    createElement('div', { class: 'item' }, ['8'])
]);

// 如果平级元素有互换问题，那也会从新渲染
// 新增节点也不会被更新
// 需要index实现换位和更新 正式课来讲

let el = render(vertualDom);
renderDom(el, window.root);

let patches = diff(vertualDom, vertualDom2);
patch(el, patches)
console.log(patches);

