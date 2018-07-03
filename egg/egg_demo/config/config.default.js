exports.keys = 'william';   // 加密cookie
exports.view = {
    defaultViewEngine: 'ejs',   // 默认的渲染引擎
    mapping: {
        '.ejs': 'ejs'   // 如果渲染的是。ejs的模板文件的话，用ejs模板引擎来渲染
    }
}
exports.middleware = [
    'time',
    'ua'
];
exports.time = {
    prefix: '本次请求一共花了 '
}
exports.ua = {
    uas: [/Firefox/]
}
exports.view = {
    defaultViewEngine: 'ejs', // 默认的渲染引擎
    mapping: {
        // 如果渲染的是.ejs的模板文件的话，用ejs模板引擎来进行渲染
        '.ejs': 'ejs'
    }
};
exports.news = {
    url: 'https://news.baidu.com/'
};