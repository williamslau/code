// koa自己封装的
// let request = {
//     get query() {    // 对象的git方法
//         return this.a
//     },
//     set query(val) {
//         this.a = val
//     }
// }
// request.query = 100;
// console.log(request.query);

let url = require('url');

let request = {
    get query() {    // 对象的git方法
        return url.parse(this.req.url, true).query;
    },
    get method() {
        return this.req.method;
    }
}
module.exports = request;