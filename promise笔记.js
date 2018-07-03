// 异步的发展流程

// callback promise generator+co async/await

// callback
// 高阶函数
// 函数可以作为参数或者函数还可以作为返回值

// 判断数据类型
// 普通函数写法
function isType(type, content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`;
}

console.log(isType('String', 'aaaa'));

// 偏函数
// 函数参数可以先预置进去，这样的函数叫做偏函数
// 可以批量生成函数
function isType(type) {
    return function (content) {
        return Object.prototype.toString.call(content) === `[object ${type}]`;
    }
}
let isString = isType('String');
let isNumber = isType('Number');
console.log(isString('aaa'));
console.log(isNumber(11));

// 预制函数
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

// 高阶函数callback
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



// promise(承诺) 
// 默认情况下是padding，执行后成功会执行resolve,失败会执行reject。
// promise可以简化的操作就是回调地狱

// 基础用法
let promise = new Promise(function (resolve, reject) {
    console.log('padding');
    resolve('成功');
    //reject('失败');
});
promise.then(function (data) {
    console.log('data', data);
}, function (err) {
    console.log('err', err);
});
// 运行结果
// padding
// data 成功

// 配合readFile使用
// 如果返回普通值，会将这个值作为下一个then的成功回掉
// 如果返回值是个promise ,会将promise的结果返回到下一个promise中
// 如果有错误，会统一走尾部的catch方法
let fs = require('fs');
function read(url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}
read('./1.txt').then(function (data) {
    console.log(data);
    return read(data);
}).then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
});;
// 运行结果
// 2.txt
// 文件内容

// Promise.all 一起读两个函数
// err 如果有一个失败所有的都失败
let fs = require('fs');
function read(url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}
Promise.all([read('1.txt'), read('2.txt')]).then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
});

// promise的静态方法
Promise.resolve([1, 2, 3]).then(function (data) {
    console.log(data);
});

Promise.reject([1, 2, 3]).then(null, function (err) {
    console.log('err', err)
});


// 封装promise
function Promise(executor) {    // executor是一个执行函数
    let self = this;
    self.status = 'pending';
    self.value = undefined;     // 默认成功的值
    self.reason = undefined;    // 默认失败的值
    self.onResolvedCallbacks = [];  // 存放成功的回掉
    self.onRejectedCallbacks = [];  // 存放失败的回掉
    function resolve(value) {   // 成功状态
        self.status = 'resolved';
        self.value = value;
        self.onResolvedCallbacks.forEach(function (fn) {
            fn();
        });
    }
    function reject(reason) {   // 失败状态
        self.status = 'rejected';
        self.reason = reason;
        self.onRejectedCallbacks.forEach(function (fn) {
            fn();
        });
    }
    try {
        executor(resolve, reject);
    } catch (e) {   // 处理异常状态,传给reject
        reject(e);
    }
};
function resolvePromise(p2, x, resolve, reject) {
    //1.处理乱写
    //2.判断返回的是不是自己
    if (p2 === x) {
        reject(new typeError('循环引用'));
    }
    //判断x是不是params(判断x是不是object)
    let called; //表示是否调用过成功或者失败
    if (x !== null || typeof x === 'object' || typeof x === 'function') {
        //判断promise只要判断对象中是否有then方法
        try {
            let then = x.then;
            if (typeof then === 'function') { //then返回的可能是{then:xxx}，判断then是不是一个函数
                then.call(x, function (y) { //成功了以后可能会执行resolve(new Promise())用递归来解决
                    if (called) return;
                    called = true;
                    resolvePromise(p2, y, resolve, reject);
                }, function (err) {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {  //esle普通值
        resolve(x);
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {  //判断onFulfilled是不是一个函数，不是给他个函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value;
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (err) {
        throw err;
    }
    let self = this;
    let promise2;           //实现链式操作
    if (self.status === 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        });
    }
    if (self.status === 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        });
    }
    if (self.status === 'pending') {
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
            self.onRejectedCallbacks.push(function () {
                setTimeout(function () {
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
        });
    }
    return promise2;
}
// catch 捕获错误的方法 原理就是一个then(null,function(){})
Promise.prototype.catch = function (callback) {
    return this.then(null, callback)
}
// promise.all 方法
Promise.all = function (promises) { //promises是一个promise的数组
    return new Promise(function (resolve, reject) {
        let arr = []; //arr是最终返回值的结果
        let i = 0; // 表示成功了多少次
        function processData(index, y) {
            arr[index] = y;
            if (++i === promises.length) {
                resolve(arr);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function (y) {
                processData(i, y)
            }, reject)
        }
    })
}
// Promise.race 方法
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject)
        }
    })
}
// 生成一个成功的promise
Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        resolve(value);
    })
}
// 生成一个失败的promise
Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    })
}
// 添加测试用例
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

// 普通用法
let p = new Promise(function (resolve, reject) {
    resolve('成功')
});
p.then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
});

// Promise.all
let fs = require('fs');
function read(url) {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        })
    })
}
Promise.all([read('./5.txt'), read('./4.txt')]).then(function (data) {
    console.log(data);
})

// Promise.race
function read(url) {
    return new Promise(function (resolve, reject) {
        require('fs').readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        })
    })
}
Promise.race([read('./2.promise/1.txt'), read('./2.promise/2.txt')]).then(function (data) {
    console.log(data)
})

// Promise.resolve
Promise.resolve([1, 2, 3]).then(function (data) {
    console.log(data);
});

//Promise.resolve
Promise.reject([1, 2, 3]).then(null, function (err) {
    console.log('err', err)
});

// 测试用例用法
// 下载一个Promise的测试库,promises-aplus-tests,
// npm install -g 文件名  运行
let fs = require('fs');
function read() {
    let defer = Promise.defer();
    fs.readFile('./1.txt', 'utf8', function (err, data) {
        if (err) defer.reject(err);
        defer.resolve(data);
    });
    return defer.promise;

}
read().then(function (data) {
    console.log(data);
});

// Promise Q库 已经没人用了
// 需要下载 npm install q

let Promise = require('./Promise.js');
function read(url) {
    return new Promise(function (resolve, reject) {
        require('fs').readFile(url, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data);
        })
    })
}
let Q = require('q');
Q.all([read('./1.txt'), read('./2.txt')]).then(function ([a1, a2]) {
    console.log(a1, a2)
});
// 同 Promise.all
Q.fcall(function () {
    return 100;
}).then(function (data) {
    console.log(data);
})
// defer
let Q = require('q');
function read(url) {
    let defer = Q.defer();
    require('fs').readFile(url, 'utf8', function (err, data) {
        if (err) defer.reject(err);
        defer.resolve(data);
    })
    return defer.promise
}
read('./2.promise/1.txt').then(function (data) {
    console.log(data);
});


// blueBird 已经被node吞并
// 将方法promise化
// npm install bluebird （现在已经不用下载）
let fs = require('fs');
let bluebird = require('bluebird');
let read = bluebird.promisify(fs.readFile);
read('./1.txt', 'utf8').then(function (data) {
    console.log(data);
});

// blueBird实现原理
// promise化
let fs = require('fs');
function promisify(fn) {  // 将回调函数在内部进行处理
    return function (...args) {
        return new Promise(function (resolve, reject) {
            fn(...args, function (err, data) {
                if (err) reject(err);
                resolve(data);
            })
        })
    }
}
// 将所有方法全部promise化
// keys es5将对象转化成数组的方法
function promisifyAll(obj) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'function') {
            obj[key + 'Async'] = promisify(obj[key])
        }
    })
}
promisifyAll(fs); // 将所有的方法全部增加一个promise化
fs.readFileAsync('./1.txt', 'utf8').then(function (data) {
    console.log(data);
});



// generator (迭代器)
// 会将函数分割出好多部分调用一次next就会继续向下执行
// 配合promise
// generator也是一个函数，和普通函数不一样，可以有暂停的功能
// 迭代器就是有next方法的，没次调用后都会返回一个done和一个叫value的属性

// generator 用法
// 可以配置yield 
function* read(arrs) {
    yield arrs[0];
    yield arrs[1];
    yield arrs[2];
}
let it = read(['react', 'vue', 'angular']);
let flag = true
do {
    let { done, value } = it.next();
    flag = done;
    console.log(value);
} while (!flag);

// 迭代器的实现原理
function read(arrs) {
    let index = 0; // 默认迭代第一项
    let len = arrs.length;
    return {
        next() {
            return { value: arrs[index], done: index++ === len ? true : false }
        }
    }
}
let it = read(['react', 'vue', 'angular']);
console.log(it.next()); // {done:false,value:'react'}
console.log(it.next()); // {done:false,value:'vue'}
console.log(it.next()); // {done:false,value:'angular'}
console.log(it.next()); // {done:true,value:undefined}
// 运行结果
// { value: 'react', done: false }
// { value: 'vue', done: false }
// { value: 'angular', done: false }
// { value: undefined, done: true }

// 配合do while
function read(arrs) {
    let index = 0; // 默认迭代第一项
    let len = arrs.length;
    return {
        next() {
            return { value: arrs[index], done: index++ === len ? true : false }
        }
    }
}
let it = read(['react', 'vue', 'angular']);
let flag = true
do {
    let { done, value } = it.next();
    flag = done;
    console.log(value);
} while (!flag)
//运行结果
// react
// vue
// angular
// undefined

// yield后面跟着的是value的值
// yield等号前面的是我们当前调用next传进来的值
// 第一次next传值是无效的
function* read(n) {
    console.log(n);
    let a = yield '一';
    console.log(a);
    let b = yield '二'
    console.log(b);
    return b;
}
let it = read(111);
console.log(it.next());
console.log(it.next('1'));
console.log(it.next('2'));
console.log(it.next('3'));
// 运行结果
// 111
// { value: '一', done: false }
// 1
// { value: '二', done: false }
// 2
// { value: '2', done: true }
// { value: undefined, done: true }

// generator配合promise

let fs = require('fs');
let blueBird = require('blueBird');
let read = blueBird.promisify(fs.readFile);
function* r() {
    let content1 = yield read('./1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}
let it = r();
it.next().value.then(function (data) {
    console.log(data);
    it.next(data).value.then(function (data) {
        console.log(data);
    });
});
// 运行结果
// /2.txt
// ﻿�Һ�˧

// co库
// npm install co
// 可以自动的将generator进行迭代
let fs = require('fs');
let co = require('co');
let blueBird = require('blueBird');
let read = blueBird.promisify(fs.readFile);
function* r() {
    let content1 = yield read('./1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}

co(r()).then(function (data) {
    console.log(data);
});

// 封装co 原理就是一个递归
let fs = require('fs');
let blueBird = require('blueBird');
let read = blueBird.promisify(fs.readFile);
function* r() {
    let content1 = yield read('./1.txt', 'utf8');
    let content2 = yield read(content1, 'utf8');
    return content2;
}
function co(it) {
    return new Promise(function (resolve, reject) {
        function next(d) {
            let { value, done } = it.next(d);
            if (!done) {
                value.then(function (data) {
                    next(data)
                }, reject)
            } else {
                resolve(value);
            }
        }
        next();
    });
}
co(r()).then(function (data) {
    console.log(data)
})


// async await
// 等价于generator + co
// 用async 来修饰函数，aysnc需要配await,await只能跟promise
let fs = require('fs');
let blueBird = require('blueBird');
let read = blueBird.promisify(fs.readFile);
async function r() {
    try {
        let content1 = await read('./2.promise/100.txt', 'utf8');
        let content2 = await read(content1, 'utf8');
        return content2;
    } catch (err) {
        console.log('err', err)
    }
}
r().then(function (data) {
    console.log(data);
});

// async / await 解决的问题有哪些
// 1.回调地狱
// 2.并发执行异步，在同一时刻同步返回结果 Promise.all
// 3.解决了返回值的问题
// 4.可以实现代码的try/catch;



