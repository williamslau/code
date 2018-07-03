let Promise = require('./Promise5.js');
let p = new Promise(function (resolve, reject) {
    reject('11111')
});
p.then().then().then().then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});

//promise中值的穿透(promise.then().then().then(function(resolve){resolve()})),promise中什么都不传
