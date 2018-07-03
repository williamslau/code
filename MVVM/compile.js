class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // el能获取到，才开始编译
            // 1.先把真实的DOM移入到内存中，fragment
            let fragment = this.node2fragment(this.el);
            // 2.编译，提取想要的元素节点（v-model）和文本节点{{}}
            this.compile(fragment);

            // 3.吧编译好的fragment在塞回到页面中去
            this.el.appendChild(fragment)
        }
    }
    // 分为两部分
    // 专门放一些辅助的方法
    // 判断el是不是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
    isDirective(name) {
        return name.includes('v-');
    }
    // 核心的方法
    compileElement(node) {
        // 带v-model
        let attrs = node.attributes;    // 获取所有属性
        Array.from(attrs).forEach(attr => {
            // 判断属性名字是不是包含v-
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                // 如果有，取到对应的值放在节点中
                let expr = attr.value;
                let [, type] = attrName.split('-');
                // node this.vm.$data
                CompileUtil[type](node, this.vm, expr)
            }
        });
    }
    compileText(node) {
        //带{{}}
        let expr = node.textContent;   // 取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g;
        if (reg.test(expr)) {
            // node this.vm.$data  expr
            CompileUtil['text'](node, this.vm, expr)
        }
    }
    compile(fragment) {
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElementNode(node)) {
                // 元素节点 需要编译元素
                // 还需要继续深入的检查
                this.compileElement(node);
                this.compile(node)
            } else {
                // 文本节点 需要编译文本
                this.compileText(node);
            }
        });
    }
    node2fragment(el) {
        // 需要将el中的内容全部放在内存中
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment;    // 内存中的节点
    }

}

CompileUtil = {
    getVal(vm, expr) {              //获取实例上对应的数据
        expr = expr.split('.');     // 数据可能是多层的拆分成数组
        return expr.reduce((prev, next) => {  // vm.$data.a
            return prev[next];
        }, vm.$data);
    },
    getTextVal(vm, expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1]);
        })
    },
    text(node, vm, expr) {     // 文本处理
        let updateFn = this.updater['textUpdater'];
        let value = this.getTextVal(vm, expr);
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], (newValue) => {
                // 如果数据变化了，文本节点需要从新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, expr));
            });
        })
        updateFn && updateFn(node, value);
    },
    setVal(vm, expr, value) { // [message,a]
        expr = expr.split('.');
        // 收敛
        return expr.reduce((prev, next, currentIndex) => {
            if (currentIndex === expr.length - 1) {
                return prev[next] = value;
            }
            return prev[next];
        }, vm.$data);
    },
    model(node, vm, expr) {    // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        // 这里应该加一个监控，数据变化了，应该调用watch的callback
        new Watcher(vm, expr, (newValue) => {
            updateFn && updateFn(node, this.getVal(vm, expr));
        });
        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue);
        });
        updateFn && updateFn(node, this.getVal(vm, expr));
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value;
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}