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
Promise.prototype.then = function (onFulfilled, onRejected) {
    let self = this;
    let promise2;           //实现链式操作
    if (self.status === 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            try {
                let x = onFulfilled(self.value);
                resolve(x);
            } catch (e) {
                reject(e);
            }
        });
    }
    if (self.status === 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            try {
                let x = onRejected(self.reason);
                reject(x);
            } catch (e) {
                reject(e);
            }
        });
    }
    if (self.status === 'pending') {
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function () {
                try {
                    let x = onFulfilled(self.value);
                    resolve(x);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push(function () {
                try {
                    let x = onRejected(self.reason);
                    reject(x);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    return promise2;
}
module.exports = Promise;