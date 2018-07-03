let Promise = require('./Promise2.js');
let p = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('成功');
    }, 1000);
    //throw new Error('错误');
});

p.then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});
p.then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
})
//Promise可以多次then,当成功后会将then中的成功方法按照顺序执行，
//我们可以将成功的回掉和失败的回掉存到数组中，当成功时调用成功的数组