let Promise = require('./Promise3.js');
let p = new Promise(function (resolve, reject) {
    resolve('11111')
});
p.then(function (data) {
    console.log('1', data);
    return 2222;
}, function (err) {
}).then(function (data) {
    console.log('2', data)
}, function (err) {
})
//链式操作promise不能返回this，实现链式操作靠的是返回一个新的promise
// let p = new Promise(function(resolve,reject){
//     resolve('aaa');
// });
// let p2 = p.then(function(){
//     throw new Error('错误');
// });
// p2.then(function(data){},function(err){
//     console.log(err);
// });