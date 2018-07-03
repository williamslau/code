//发布订阅
//原理 {'失恋':[drink,findBoy]};on的时候将函数放到数组中，enit的时候按顺序执行数组中的函数
//let EventEmittre = require('events');
let EventEmittre = require('./myEvents');
let util = require('util');
function Girl() {

}
util.inherits(Girl, EventEmittre);
let girl = new Girl();
let drink = function (data) {
    console.log('喝酒', data);
};
let findBoy = function () {
    console.log('找男朋友');
}
// //普通用法
// girl.on('失恋',drink);
// girl.on('失恋',findBoy);
// girl.emit('失恋');
//     // con 喝酒
//     //     找男朋友


// //可以emit多次
// girl.on('失恋',drink);
// girl.on('失恋',findBoy);
// girl.emit('失恋');
// girl.emit('失恋');
// // con     喝酒
// //         找男朋友
// //         喝酒
// //         找男朋友

// //once只只执行一次
// girl.once('失恋',drink);
// girl.on('失恋',findBoy);
// girl.emit('失恋');
// girl.emit('失恋');
// // con     喝酒
// //         找男朋友
// //         找男朋友

// //removeListener()用法
// girl.on('失恋',drink);
// girl.on('失恋',findBoy);
// girl.removeListener('失恋',findBoy);
// girl.emit('失恋',1);
// girl.emit('失恋');
// // con     喝酒
// //         喝酒

// //emit可以传参，传参的数量不限所以用...来接收
// girl.on('失恋',drink);
// girl.on('失恋',findBoy);
// girl.emit('失恋',1);
// girl.emit('失恋');
// // con     喝酒
// //         找男朋友
// //         找男朋友

// //newListener
// girl.on('newListener', function (eventName) {
//     console.log(eventName);
// });
// girl.once('失恋', findBoy);
// girl.once('失恋', findBoy);
// girl.removeListener('失恋', findBoy);
// girl.emit('失恋', 1);
// girl.emit('失恋');

// // setMaxListener
// girl.setMaxListeners(3);
// console.log(girl.getMaxListeners());

// girl.on('失恋',drink);
// girl.on('失恋',findBoy);
// girl.on('失恋',drink);
// girl.on('失恋',findBoy);

//prependListener
girl.on('失恋', drink);
girl.on('失恋', findBoy);
girl.on('失恋', drink);
girl.prependListener('失恋', function () {
    console.log('before');
});
girl.emit('失恋');
girl.emit('失恋');