function Promise(executor) {
    let self = this;
    self.status = 'pending';
    self.value = undefined;
    self.reason = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];
    function resolve(value) {
        self.status = 'resolved';
        self.value = value;
        self.onResolvedCallbacks.forEach(function (fn) {
            fn();
        });
    }
    function reject(reason) {
        self.status = 'rejected';
        self.reason = reason;
        self.onRejectedCallbacks.forEach(function (fn) {
            fn();
        });
    }
    try {
        executor(resolve, reject);
    } catch (e) {
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

module.exports = Promise;