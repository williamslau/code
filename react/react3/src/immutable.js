

// node导入immutable List Map

// 1.只操作对象
// 返回的m1就是不可变对象，永远不会变
// 调用set后永远返回的都是一个新的不可变对象
let { Map } = require('immutable');
let obj = { a: 1 };
let m1 = Map(obj);
let m2 = m1.set('a', 100);
console.log(m1.get('a'));
console.log(m2.get('a'));

let { Map } = require('immutable');
let obj = { a: 1 };
let m1 = Map(obj);
let m2 = m1.update('a', (a) => (a + 100));
console.log(m1.get('a'));
console.log(m2.get('a'));



// Map 只处理一层
let { Map } = require('immutable');
let obj = { a: { a: 1 }, b: 2 };
let m1 = Map(obj);
console.log(m1);

// 处理多层用fromJS
// 公用的部分会共享
let { Map, fromJS } = require('immutable');
let obj = { a: { a: 1 }, b: 2 };
let m1 = fromJS(obj);
let m2 = m1.set('b', 3);
console.log(m1.get('a') === m2.get('a'));
console.log(m1.get('b') === m2.get('b'));
console.log(m1);
console.log(m2);


// 嵌套多层
let { Map, fromJS } = require('immutable');
let obj = { a: { b: { c: { d: 1 }, d: 100 }, m: 100 } };
let m1 = fromJS(obj);
let m2 = m1.setIn(['a', 'b', 'c', 'd'], 2);
console.log(m2.getIn(['a', 'b', 'c', 'd']));
console.log(m1.getIn(['a', 'b', 'c', 'd']));

// list和Map是等价的，但是只支持一层的数组
let { Map, fromJS, List } = require('immutable');
let obj = [[1, 2, 3], [4, 5, 6]];
let m1 = List(obj);
console.log(m1.get(0));


// 再转化为js m1.toJS().a
let { Map, fromJS, List } = require('immutable');
let m1 = fromJS({ a: 1 });
console.log(m1.a);
console.log(m1.toJS().a);

// 想要比较里面的内容是否一样is(m1, m2)
let { Map, fromJS, List, is } = require('immutable');
let m1 = fromJS({ a: 1 });
let m2 = fromJS({ a: 1 });
console.log(m1 === m2);
console.log(is(m1, m2));







