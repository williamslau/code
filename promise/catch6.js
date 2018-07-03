let Promise = require('./Promise6.js');
let p = new Promise(function (resolve, reject) {
    reject('11111')
});
p.then().then().then().then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});
