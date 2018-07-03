function* read() {
    console.log(1);
    let a = yield 'aaa';
    console.log(a);
    let b = yield a;
    console.log(b);
    return b;
};
let it = read();
console.log(it.next());
console.log(it.next(222));
console.log(it.next(333));

//bluebird +promise
let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);

function* r() {
    let content1 = yield read('./1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}

let it = r();
it.next().value.then(function (data) {
    console.log(data.toString());
    it.next(data).value.then(function (data) {
        console.log(it.next(data).value);
    });
});

//co库  可以自动的将generator进行迭代
let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);
let co = require('co');

function* r() {
    let content1 = yield read('./1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}

co(r()).then(function (data) {
    console.log(data);
});
//练习，缕清

let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);
let co = require('co');

function* r() {
    let content1 = yield read('./1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}

let it = r();
it.next().value.then(function (data) {
    it.next(data).value.then(function (a) {
        console.log(it.next(a).value);
    })
});
function* r(a) {
    let b = yield a;
    b + 1;
    let c = yield b;
    c + 1;
    return c
}
let it = r(1);
console.log(it.next());
console.log(it.next(2));
console.log(it.next(4));

//自己实现co库
//搁置
//async和arait === co+generator
let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);
async function r() {
    let content1 = await read('./1.txt', 'utf8');
    let content2 = await read(content1, 'utf8');
    return content2
}
r().then(function (data) {
    console.log(data);
});