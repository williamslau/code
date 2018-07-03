
// 代理request和reponse
let proto = {

}
function delateGetter(property, name) {
    proto.__defineGetter__(name, function () {
        return this[property][name];
    })
}
function delateSetter(property, name) {     // 设置body的方法
    proto.__defineSetter__(name, function (val) {
        this[property][name] = val;
    })
}
// proto 在application 中赋给了cex let ctx = Object.create(this.context);
// proto.query == request.query
// 让proto代理request上的query属性
delateGetter('request', 'query');
delateGetter('request', 'method');
// 获取设置body的方法
delateGetter('response', 'body');
delateSetter('response', 'body');
module.exports = proto;