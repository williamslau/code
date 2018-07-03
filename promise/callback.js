


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function isType(type, content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`;
}

console.log(isType('String', 'aaaa'));

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function isType(type) {
    return function (content) {
        return Object.prototype.toString.call(content) === `[object ${type}]`;
    }
}
let isString = isType('String');
console.log(isString('aaa'));


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

function after(times, callback) {
    return function () {
        if (--times === 0) {
            callback();
        }
    }
}
let eat = after(3, function () {
    console.log('完成');
});
eat();
eat();
eat();

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

let fs = require('fs');
function out(times, callback) {
    let arr = [];
    return function (data) {
        arr.push(data);
        if (arr.length === times) {
            callback();
        }
    }
}
let last = out(2, function (data) {
    console.log(arr);
});
fs.readFile('./1.txt', 'utf8', function (err, data) {
    last(data);
});
fs.readFile('./2.txt', 'utf8', function (err, data) {
    last(data);
});

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

