let Promise = require('./Promise4.js');
let p = new Promise(function (resolve, reject) {
    resolve('11111')
});
p.then(function (data) {
    console.log('1', data);
    return new Promise(function (resolve) {
        resolve('新的promise');
    });
}, function (err) {
}).then(function (data) {
    console.log('2', data)
}, function (err) {
})

//如果then中无论是成功的回调还是失败的回调只要返回了结果就会走下一个then中的成功，如果有错误走下一个then的失败

//then里面return可以return普通值，也可以return new Promise()。如果return自己则报错
