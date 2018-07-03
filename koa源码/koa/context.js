let proto = {

};
function defineGetter(property, name) {
    //自定义获取器 代理
    proto.__defineGetter__(name, function () {
        return this[property][name];
    });
}
defineGetter('request', 'url');
defineGetter('request', 'path');
module.exports = proto;