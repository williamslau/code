
let Promise = require('./Promise.js');
let p = new Promise(function (resolve, reject) {
    resolve('成功');
    //reject('失败');
});

p.then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});