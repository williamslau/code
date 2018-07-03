// 代理分为正向代理和反向代理

// 正向代理如翻墙工具（由客户端发起）
// 客户端和代理服务器为主体，访问被代理的服务器
// 正向代理可以帮助我们访问无法访问的资源（翻墙）
// 可以做缓存，加速访问资源
// 可以对客户端访问权限，上网进行验证
// 上网行为管理 记录用户访问记录，对外隐藏用户信息


// 反向代理由服务器发起，缓解服务端的压力（由服务端发起）
// 反向代理不知道代理的存在
// 负载均衡，通过反向代理服务器来优化网站的负载


// 反向代理
// http-proxy模块
// 代理到8000.js服务器
// 开启node 8000.js 然后浏览器访问localhost:3000会代理到8000
let httpProxy = require('http-proxy');
let http = require('http');
let proxy = httpProxy.createProxyServer();
http.createServer(function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8000'
    });
}).listen(3000);


// 虚拟主机
let httpProxy = require('http-proxy');
let http = require('http');
let proxy = httpProxy.createProxyServer();
let hosts = {
    'www.zf1.cn': 'http://localhost:5000',
    'www.zf2.cn': 'http://localhost:8000',
}
http.createServer(function (req, res) {
    let host = req.headers['host'];

    proxy.web(req, res, {
        target: hosts[host]
    });
}).listen(80);