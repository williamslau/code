class MVVM {
    constructor(options) {
        // 一上来先把可用的东西挂载再实例上
        this.$el=options.el;
        this.$data=options.data;
        if(this.$el){
            // 数据劫持，就是吧对象的虽有属性改成get set方法
            new Observer(this.$data);
            this.proxyData(this.$data);
            // 用数据和元素进行编译
            new Compile(this.$el,this);
        }
    }
    // 如果又要编译的模板，我们就开始编译
    proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key] = newValue
                }
            })
        })
    }
};