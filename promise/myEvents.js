//实现原理
function EventEmittre() {
    this._events = Object.create(null);
}
EventEmittre.defaultMaxListeners = 10;

EventEmittre.prototype.addListener = EventEmittre.prototype.on;

EventEmittre.prototype.setMaxListeners = function (n) {
    this._count = n;
}

EventEmittre.prototype.getMaxListeners = function () {
    return this._count ? this._count : EventEmittre.defaultMaxListeners
}

EventEmittre.prototype.eventNames = function () {
    return Object.keys(this._events);
};

EventEmittre.prototype.on = function (type, callback, flag) {
    if (!this._events) {
        this._events = Object.create(null);
    }   //  默认参数

    if (type !== 'newListener') {
        this._events['newListener'] && this._events['newListener'].forEach(listener => {
            listener(type);
        });
    }

    if (this._events[type]) {
        if (flag) {
            this._events[type].unshift(callback);
        } else {
            this._events[type].push(callback);
        }
    } else {
        this._events[type] = [callback];
    }

    if (this._events[type].length === this.getMaxListeners()) {
        console.warn('--------------------------');
    }

}

EventEmittre.prototype.removeListener = function (type, callback) {
    if (this._events[type]) {
        this._events[type] = this._events[type].filter(function (listener) {
            return callback != listener && listener.l != callback;
        });
    }
};

EventEmittre.prototype.prependListener = function (type, callback) {
    this.on(type, callback, true);
};

EventEmittre.prototype.prependListener = function (type, callback) {
    this.on(type, callback, true);
};

EventEmittre.prototype.once = function (type, callback) {
    //先绑定，调用后在删除
    function wrap() {
        callback(...arguments);
        this.removeListener(type, wrap);
    }
    wrap.l = callback;
    this.on(type, wrap);
}

EventEmittre.prototype.emit = function (type, ...args) {
    if (this._events[type]) {
        this._events[type].forEach(listener => {
            listener.call(this, ...args);
        });
    }
};

module.exports = EventEmittre;