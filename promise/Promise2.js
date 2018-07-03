function Promise(executor) {
    let self = this;
    self.status = 'pending';
    self.value = undefined;
    self.reason = undefined;
    self.onResolvedCallbacks = [];  //存放成功的回掉
    self.onRejectedCallbacks = [];  //存放失败的回掉
    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
            self.value = value;
            self.onResolvedCallbacks.forEach(function (fn) {
                fn();
            });
        }
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.reason = reason;
            self.onRejectedCallbacks.forEach(function (fn) {
                fn();
            });
        }
    }
    try {
        executor(resolve, reject);
    } catch (e) {      //处理异常状态,传给reject
        reject(e);
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    let self = this;
    if (self.status === 'resolved') {
        onFulfilled(self.value);
    }
    if (self.status === 'rejected') {
        onRejected(self.reason);
    }
    if (self.status === 'pending') {
        self.onResolvedCallbacks.push(function () {
            onFulfilled(self.value);
        });
        self.onRejectedCallbacks.push(function () {
            onRejected(self.reason);
        });
    }
};
module.exports = Promise;