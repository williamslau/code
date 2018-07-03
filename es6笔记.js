// es6 也叫se2015
// babel 可以将es6转化成es5
// 随着网络的发展，慢慢的也就不需要做兼容处理了

// 常用的api
// 1.let&&const

// var 有作用域的问题，经常会污染全局作用域
// let const 声明变量不会声明到window上(在浏览器环境中)
// 作用于：函数作用域 全局作用域
// {} 可以表示一个作用域
var a = 1;
console.log(window.a);
// 浏览器运行结果
// 1
let a = 1;
const a = 1;
console.log(window.a);
// 浏览器运行结果
// undefined

// 作用域问题 “暂存死区”
// 用let声明的变量会绑定到当前的作用域下，
let a = 1;
if (true) {
    console.log(a);
    let a = 2;
}
// 运行结果 a is not defined （未定义）

// var 的声明问题 可能会出现重复声明的问题（同一个作用于下不能背重复声明）
var a = 1;
var a = 2;
console.log(a);
// 运行结果
// 2
let a = 1;
let a = 2;
console.log(a);
// const a = 1;
// const a = 2;
// console.log(a);
// 运行结果
// 报错Identifier 'a' has already been declared（变量不能被重复声明）

// var 会变量提升（预解释）
// 用var声明的变量会预解释，但不会赋值
// 函数即会预解释又会赋值
console.log(a);
var a = 1;
// 运行结果
// undefined
console.log(a);
function a() { }
// 运行结果
// [Function: a]

// 循环绑定事件 常用在for(let i=0; i<3; i++){}
for (var i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i);
    });
}
// 运行结果
// 3 3 3
for (var i = 0; i < 3; i++) {
    (function (i) {
        setTimeout(function () {
            console.log(i);
        });
    })(i)
}
// 运行结果
// 0 1 2

for (let i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i);
    });
}
// 运行结果
// 0 1 2

// const 常量，不能被更改
// 一般常量都会用大写来表示
const a = 1;
a = 2;
// 运行结果
// Assignment to constant variable.

// 引用地址不变就可以
const a = { name: 1 };
a.name = 2
console.log(a.name);
// 运行结果
// 2



// deconstruction 解构
// 等号左边和等号右边结构相等 就可以结构
// 解构叫即声明又赋值

// 数组解构
let [, b, c] = [1, 2, 3]; // 数组的key要对应上,如果不想要可以省略空出来
console.log(b);
console.log(c);
// 运行结果
// 1 2 3

// 对象解构 
// 如果key没有对应会报undefuned 还可以赋默认值(i = 3)和更改名字(name : m)
let { n, age, name: m, i = 3 } = { name: 1, age: 2 }
console.log(n, age, m, i);
// 运行结果
// undefined 2 1 3

// 混合用法
let [{ name }, b, [c, d]] = [{ name: 1 }, 2, [3, 4]];
console.log(name, b, c, d);
// 运行结果
// 1 2 3 4

// 应用
ajax({
    url: '/user',
    method: 'get',
});
function ajax({ url = new Error(), method = 'get' }) { }



// 模板字符串
// 普通字符串 '' ""
// es6 `` 可以放变量 如果要套`需要转义 \`
let name = 'william';
let age = 9;
let str = `我叫${name},今年${age}岁`;
console.log(str);
// 运行结果
// 我叫william,今年9岁

// 模板字符串封装
let name = 'william';
let age = 9;
let str = '我叫${name},今年${age}岁';
str = str.replace(/\$\{([^}]+)\}/g, function () {
    return eval(arguments[1])
});
console.log(str);

// 模板字符串可以换行
let arr = ['williamlau', '大志'];
let newArr = arr.map(function (item) {
    return (
        `<il>
            <span>${item}</span>
        </li>`
    );
});
let str = `
    <ul>
        ${newArr.join()}
    </ul>
`;
console.log(str);

// 带标签的模板字符串 可以根据自己定义的方法对字符串进行操作
let name = 'william';
let age = 9;
function tag(arrs, ...args) {
    let str = '';
    for (let i = 0; i < args.length; i++) {
        str += (`${arrs[i]}(${args[i]})`)
    }
    str += arrs[arrs.length - 1]
    return str;
}
let newStr = tag`我叫${name},今年${age}岁`;
console.log(newStr);
// 运行结果
// 我叫(william),今年(9)岁

// includes 是否包含（数组和字符串公用的方法）
let str = 'abcdefg';
console.log(str.indexOf('1'));
console.log(str.includes('1'));
// 运行结果
// -1
// false

// endsWith 是否以XX结尾
let str = 'abcdefg';
console.log(str.endsWith('g'));
// 运行结果
// true

// startsWith 是否以XX开头
let str = 'abcdefg';
console.log(str.endsWith('a'));
// 运行结果
// true

// padStart 向前补零 padEnd 向后补零
let date = new Date();
let str = `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, 0)}月${date.getDate().toString().padEnd(2, 0)}`;
console.log(str);
// 运行结果
// 2018年04月40



// 函数 （函数还有高阶函数，偏函数，函数柯里化）

// 函数的默认参数
function fn(str = '$') {
    console.log(str);
};
fn();
// 运行结果
// $

// 箭头函数 没有function关键字，函数参数和函数体用箭头连接在一起
// 箭头函数中没有arguments,没有this指向（this穿透）谁调用this指向的就是谁
let a = (str) => {
    console.log(str);
}
a('hello');
// 运行结果
// hello
// 如果参数只有一个，可以省略小括号
let a = str => {
    console.log(str);
}
a('hello');
// 运行结果
// hello

// 如果有返回值return,可以省略大括号，箭头后面就是返回值
let a = str => console.log(str);
a('hello');
// 运行结果
// hello

// this指向问题
let obj = {
    fn: function () {
        console.log(this);
    }
}
let Fn = obj.fn;
Fn();
// 浏览器运行结果
// Window {stop: function, open: function, alert: function, confirm: function, prompt: function…}

let obj = {
    fn: function () {
        console.log(this);
    }
}
obj.fn();
// 浏览器运行结果
// Object {fn: function}
// setTimeout的this错乱 this会指向调用setTimeout的window
let age = 2;
let obj = {
    age: 1,
    fn: function () {
        setTimeout(function () {
            console.log(this.age);
        });
    }
}
obj.fn();
// 浏览器运行结果
// undefined
// let不会挂在全局作用域windows上
// 如果使用箭头函数this就会指向调用他的obj
let age = 2;
let obj = {
    age: 1,
    fn: function () {
        setTimeout(() => {
            console.log(this.age);
        });
    }
}
obj.fn();
// 浏览器运行结果
// 1

// 对象中没有作用域
let age = 2;
let obj = {
    age: 1,
    fn: () => {
        setTimeout(() => {
            console.log(this.age);
        });
    }
}
obj.fn();
// 浏览器运行结果
// undefined


// 剩余运算符&展开运算符 
// ...剩余运算符 只能在函数的最后一个参数使用
function fn(str, ...args) {
    console.log(str);
    console.log(args);
}
fn('$', 1, 2, 3, 4);
// 运行结果
// $
// [ 1, 2, 3, 4 ]

// ...展开运算符
let arr = [1, 2, 3];
console.log(...arr);
// 运行结果
// 1 2 3
// 用法对比
// apply 可以改变this指向， 可以传参
let arr = [5, 7, 31, 2, 3];
console.log(Math.min.apply(Math, arr));
console.log(Math.min(...arr));
// 运行结果
// 2


// 可以合并对象和数组
// 数组的展开
let arr = [];
let arr1 = [1, 2];
let arr2 = [3, 4];
let newArr = arr.concat(arr1, arr2);
//or
let arr1 = [1, 2];
let arr2 = [3, 4];
let newArr = [...arr1, ...arr2];
console.log(newArr);
// 运行结果
// [ 1, 2, 3, 4 ]

// 对象的展开
let school = { name: 'zfpx', age: 9 };
let me = { name: 'jw', address: '回龙观' }

let obj = { ...school, ...me };
console.log(obj);
// 运行结果
// { name: 'jw', age: 9, address: '回龙观' }

// assign和展开运算符可以算是等价的
let school = { name: 'zfpx', age: 9 };
let me = { name: 'jw', address: '回龙观' }
let result = Object.assign(school, me);
console.log(result);

// 深度clone
// JSON.parse(JSON.stringify());
// 这个方法有个缺点就是不能拷贝函数和正则

let school = { name: 'zfpx', age: { age: 1 }, fn: function () { }, reg: /\d+/ }
let result = JSON.parse(JSON.stringify(school));
school.age.age = 2;
console.log(result);
// 运行结果
// { name: 'zfpx', age: { age: 1 }, reg: {} }

// 递归拷贝

// let school = { name: 'zfpx', age: { age: 1 }, arr: [1, 2, 3], fn: function () { }, reg: /\d+/ }
let school = [{ a: 1, b: [1, 1], fn: function () { } }, [1, 1], /\d+/, null]
function deepClone(parent) {
    let child;
    let type = Object.prototype.toString.call(parent);
    switch (type) {
        case '[object Array]':
            child = [];
            for (let i = 0; i < parent.length; i++) {
                child[i] = deepClone(parent[i]);
            }
            break;
        case '[object Object]':
            child = {};
            for (let key in parent) {
                child[key] = deepClone(parent[key]);
            }
            break;
        default:
            child = parent;
            break;
    }
    return child;
}
let result = deepClone(school);
result[0].a = 2;
result[1][0] = 2;
console.log(school);
// 运行结果
// [ { a: 1, b: [ 1, 1 ], fn: [Function: fn] },[ 1, 1 ],/\d+/,null ]


let school = [{ a: 1, b: [2, 3], fn: function () { } }, [4, 5], /\d+/, null, 'aaaa', undefined]
function deepClone(parent) {
    let type = Object.prototype.toString.call(parent);
    let child = type === '[object Array]' ? [] : type === '[object Object]' ? {} : parent;
    console.log(child == parent);
    console.log(child);
    console.log(parent);
    if (child != parent) {
        for (let key in parent) {
            child[key] = deepClone(parent[key]);
        }
    }
    return child;
}
let result = deepClone(school);
result[0].a = 222
result[1][0] = 222;
console.log(school);
console.log(result);
// 运行结果
// [ { a: 1, b: [ 1, 1 ], fn: [Function: fn] },[ 1, 1 ],/\d+/,null ]




// 数组

// Array.from() 将类数组转化为数组 等价于 Array.prototype.slice.call();
// 常见的类数组 arguments domCollection
let result = Array.from({ 0: 1, 1: 2, length: 3 });
console.log(result);
// 运行结果
// [ 1, 2, undefined ]
let result = Array.prototype.slice.call({ 0: 1, 1: 2, length: 2 }, 0);
// 运行结果
// [ 1, 2, undefined ]

// Array.of()  Array()  file()
console.log(Array.of(3));// [3]
console.log(Array(3)); // [ <3 empty items> ]
console.log(Array(3).fill(3)); // [ 3, 3, 3 ]

// reduce map filter some every forEach es5
// find findIndex es6
// includes es7


// reduce 叠加
// 求和
let result = [1, 2, 3, 4, 5].reduce((prev, next, index, current) => {
    console.log(prev, next, index, current);
    return prev + next;
}, 15);  // 手动改变数组的第一项，数组的长度不变
console.log(result);
// 运行结果
// 15 1 0 [ 1, 2, 3, 4, 5 ]
// 16 2 1 [ 1, 2, 3, 4, 5 ]
// 18 3 2 [ 1, 2, 3, 4, 5 ]
// 21 4 3 [ 1, 2, 3, 4, 5 ]
// 25 5 4 [ 1, 2, 3, 4, 5 ]
// 30

// 求平均数
let result = [1, 2, 3, 4, 5].reduce((prev, next, index, current) => {
    if (index === current.length - 1) return (prev + next) / current.length
    return prev + next;
});
console.log(result);
// 运行结果
// 3

// reduce 封装

Array.prototype.myReduce = function (callback, pre) {
    let prev = pre || this[0];
    for (let i = pre ? 0 : 1; i < this.length; i++) {
        prev = callback(prev, this[i], i, this);
    }
    return prev;
}
let result = [1, 2, 3, 4, 5].myReduce((prev, next, index, current) => {
    console.log(prev, next, index, current);
    if (index === current.length - 1) return (prev + next) / current.length
    return prev + next;
}, 15);
console.log(result);
// 运行结果
// 15 1 0 [ 1, 2, 3, 4, 5 ]
// 16 2 1 [ 1, 2, 3, 4, 5 ]
// 18 3 2 [ 1, 2, 3, 4, 5 ]
// 21 4 3 [ 1, 2, 3, 4, 5 ]
// 25 5 4 [ 1, 2, 3, 4, 5 ]
// 6


// map 
let arr = ['williamlau', '大志'];
let newArr = arr.map(function (item) {
    return (
        `<il>
            <span>${item}</span>
        </li>`
    );
});
let str = `
    <ul>
        ${newArr.join()}
    </ul>
`;
console.log(str);
// 运行结果
// <ul>
//     <il>
//         <span>williamlau</span>
//     </li>,<il>
//         <span>大志</span>
//     </li>
// </ul>

// filter 过滤 返回true表示当前想留下，返回false 表示不留
let filterArr = [1, 2, 3, 4, 5].filter((item, index) => {
    if (item > 3) return true;
});
console.log(filterArr);

// filter 封装 
Array.prototype.myFilter = function (callback) {
    let arr = [];
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i) ? arr.push(this[i]) : void 0;
    }
    return arr;
}
let filterArr = [1, 2, 3, 4, 5].myFilter((item, index) => {
    if (item > 3) return true;
});
console.log(filterArr);
// 运行结果
// [4, 5]

// some,every 查找数组中是否包含某一项
// some找true找到了返回true  every找false找到了返回false
let flag = [1, 2, 3].some(function (item, index) {
    return item === 2
});
console.log(flag);

// includes 是否包含（数组和字符串公用的方法）
let str = 'abcdefg';
console.log(str.indexOf('1'));
console.log(str.includes('1'));
// 运行结果
// -1
// false



// 对象

// 对象可以简写，如果key和value相等则可以简写
let name = 'zfpx';
let age = 9
let obj = {
    name,
    age,
    fn() {           // 等价于普通函数，有this指向的，而非箭头函数
        console.log(this)
    }
};
obj.fn();


// Object.setPrototypeOf() 设置原型链
let o2 = {
    age: 18,
}
let o1 = {
    name: 'zfpx',
}
Object.setPrototypeOf(o1, o2);
console.log(o1.age);
// 运行结果
// 18

// 等价于以前的老写法
let o2 = {
    age: 18,
}
let o1 = {
    name: '1111',
    __proto__: o2,
}
console.log(o1.age);
// 运行结果
// 18

// 从o1取o2里的name （从原型链上拿东西）用super
// super在子对象中指向的是__proto__对应的内容
let o2 = {
    age: 18,
    name: '2222'
}
let o1 = {
    name: '1111',
    __proto__: o2,
    getO2Name() {
        return super.name;
    }
}
console.log(o1.getO2Name());
// 运行结果
// 2222

// 等价于以前的老写法
let o2 = {
    age: 18,
    name: '2222'
}
let o1 = {
    name: '1111',
    __proto__: o2,
}
console.log(o1.__proto__.name);
// 运行结果
// 2222


// 类 以前就是构造函数 面向对象中的类

// 继承
function Parent() {
    // 类里面的都是类的私有属性
    this.name = 'aaaa';
}
Parent.prototype.smoking = function () {    // 共有的方法
    console.log('吸烟');
}
Parent.fn = function () { }; //这是Parent的静态属性
function Child() {
}
// 这种方法会也继承私有方法
Child.prototype = new Parent();
let child = new Child;
console.log(child.constructor);
console.log(child.name);
console.log(child.smoking);
// 运行结果
// [Function: Parent]
// aaaa
// [Function]

//只继承共有方法
function Parent() {
    this.name = 'aaaa';
}
Parent.prototype.smoking = function () {
    console.log('吸烟');
}
function Child() {
}
// 这种方法会也继承私有方法
Child.prototype = Object.create(Parent.prototype);
let child = new Child;
console.log(child.constructor);
console.log(child.name);
console.log(child.smoking);
// 运行结果
// [Function: Parent]
// undefined
// [Function]

// 实现方法
function Parent() {
    this.name = 'aaaa';
}
Parent.prototype.smoking = function () {
    console.log('吸烟');
}
function Child() {
}
function create(parentProto, param) {
    function Fn() { }; // 相当于构建一个类 类的原型链指向了父类的原型
    Fn.prototype = parentProto;
    let fn = new Fn();
    // 手动改变constructor的指向
    fn.constructor = param.constructor.value;
    return fn;
}
// 儿子查找时 可以查找到父类的原型，所以可以拿到父类的公共方法
Child.prototype = create(Parent.prototype, { constructor: { value: Child } });
let child = new Child;
console.log(child.constructor);
console.log(child.name);
console.log(child.smoking);



// 继承静态属性
function Parent() {
    this.name = 'aaaa';
}
Parent.fn = function () {
    console.log('静态属性');
}; //这是Parent的静态属性
Parent.prototype.smoking = function () {
    console.log('吸烟');
}
function Child() {
}
Child.prototype = Object.create(Parent.prototype, { constructor: { value: Child } });
let child = new Child;
Child.__proto__ = Parent    //继承静态属性
Child.fn();

// 定义属性的一种方法
let obj = {};
Object.defineProperty(obj, 'a', {
    enumerable: true, // 可枚举 不可枚举就不能取出来
    configurable: true, // 可配置 不可配置不能删除
    writable: true,     // 可更改 
    value: 'aaa'
});
// delete obj.a
console.log(obj);


// es6中的类 不new 不能调用
class Parent {
    constructor(name) {  // 私有属性
        this.name = name
    }

    getName() {  //  共有属性
        return this.name
    }
    static fn() {   //静态方法
        return 100;
    }
}
// es6的extends方法可以继承私有属性，也可以继承公有属性，还可以继承静态方法
// 静态方法只能类调用 而且可以继承 
class Child extends Parent {
    constructor(name, age) {
        super(name); // 子类有构造函数必须使用super 等价于Parent.call(this,name)
        this.age = age;
    }
}

let child = new Child('zf', 9);
console.log(child.name);



// 模拟es6的class用法
let Parent = function () {
    function Parent() {
        // 类的调用检测
        _classCallCheck(this, Parent);
        // return {a:100}
    }
    _createClass(Parent,
        [ // 描述公共方法
            {
                key: 'getName', value: function () {
                    return 1000;
                }
            }
        ], [ // 描述静态的方法
            {
                key: 'fn', value: function () {
                    return 100;
                }
            }
        ]
    )
    return Parent;
}()
// 类的调用检测
function _classCallCheck(instance, constructor) { //检查当前类  有没有new出来的 new出来的函数this指向当前的函数，没有new的函数因为是window调用的，所以this指向的window
    if (!(instance instanceof constructor)) throw Error('without new');
}
// 对不同的属性做处理 如果是原型上的方法挂载Class.prototype上，如果是静态方法放在Class上
function _createClass(con, protoProperty, staticProperty) {
    if (protoProperty) {
        defineProperties(con.prototype, protoProperty);
    }
    if (staticProperty) {
        defineProperties(con, staticProperty);
    }
}
// 负责将原型的方法,静态方法定义在 构造函数上
function defineProperties(constructor, properties) {
    for (let i = 0; i < properties.length; i++) {
        let obj = { ...properties[i], enumerable: true, writeable: true, configurable: true };
        Object.defineProperty(constructor, properties[i].key, obj);
    }
}
// 子类继承父类的方法
function _inherits(subClass, superClass) {
    // 子类继承父类的公有方法
    subClass.prototype = Object.create(superClass.prototype, { constructor: { value: subClass } });
    // 子类继承父类的静态方法
    subClass.__proto__ = superClass;
}
let Child = function (Parent) {  // 用封闭空间传参表示子类可以继承父类
    _inherits(Child, Parent); // 子类继承父类的方法
    function Child() {
        _classCallCheck(this, Child); // 类的调用检查
        let that = this;
        let obj = Object.getPrototypeOf(Child).call(this); // Child.__proto__ 继承父类的私有方法
        if (typeof obj === 'object') { //如果是对象就把obj做为实例
            that = obj;
        }
        return that;
    }
    return Child;
}(Parent)

let child = new Child;
console.log(child.getName());

// set && map

// set 数组去重
let set = new Set([1, 2, 3, 4, 5, 5, 4, 3]);
console.log(Array.from(set));
console.log([...set]);
// 运行结果
// [ 1, 2, 3, 4, 5 ]
// [ 1, 2, 3, 4, 5 ]

let set = new Set([1, 2, 3, 4, 5, 5, 4, 3]);
set.add(6);
console.log(Array.from(set));
// 运行结果
// [ 1, 2, 3, 4, 5, 6 ]

let set = new Set([1, 2, 3, 4, 5, 5, 4, 3]);
set.delete(2);
console.log(Array.from(set));
// 运行结果
// [ 1, 3, 4, 5, ]

let set = new Set([1, 2, 3, 4, 5, 5, 4, 3]);
console.log(set.has(2));
// 运行结果
// true

// map 键值对
let map = new Map();
map.set('js', [1, 2, 3]);
map.set('js', [4, 5, 6]);
console.log(map.has('js'));
console.log(map);