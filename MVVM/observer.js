class Observer {
    constructor(data) {
        this.observe(data);
    }
    observe(data) {
        // 要对这个data数据将原有的属性改成set和get的形式
        if (!data || typeof data !== 'object') {
            return;
        }
        // 要将数据一一劫持 先获取到data的key value
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
            this.observe(data[key]);// 深度递归劫持
        });
    }
    // 定义响应式
    defineReactive(obj, key, value) {
        let that = this;
        let dep = new Dep();    // 每个变化的数据都会对应一个数组，这个数组是存放所有更新的操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: this,
            // 当取值时
            get() {
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            // 当给data属性中设置值的时候，更改获取的属性的值
            set(newValue) {
                if (newValue != value) {
                    // 如果是对象，继续劫持
                    that.observe(newValue);
                    value = newValue;
                    dep.notify();   // 通知所有人，数据更新了
                }
            }
        });
    }
}
class Dep {
    constructor() {
        // 订阅的数组
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => watcher.update());
    }
}