// 引入需要的包

// mime             返回headers头的类型 
// chalk            粉笔 打印console的颜色输出
// debug            调试输出

// supervisor -g    监视你对代码的改动,并自动重启 Node.js
// supervisor app.js 启动监听

let config = require('./config');
let fs = require('fs');
let url = require('url');
let http = require('http');
let path = require('path');
let mime = require('mime');
let chalk = require('chalk');
let util = require('util');         // promisify 将指定方法promise化
let stat = util.promisify(fs.stat);    // 判断文件存不存在
let debug = require('debug')('static:app');
// chalk用法
// console.log(chalk.green('williamlau'));
// console.log(chalk.red('williamlau'));
// debug 后面放的参数，可以根据后面的参数决定是否打印
// 要打印需要设置环境变量 
// set DEBUG=static:app/*      windows
// export DEBUG=static:app   mac
//debug('app');
// 在命令行设置以后可以打印出来
class Server {
    constructor() {
        this.config = config;   // 将配置信息挂载到实例上
    }
    handleRequest() {
        return async (req, res) => {
            let { pathname } = url.parse(req.url, true);    // 加true不要问好后面的数据
            let p = path.join(this.config.dir, '.' + pathname);
            try {
                let statObj = await stat(p);
                if (statObj.isDirectory()) {    // 判断是不是目录（文件夹）

                } else {
                    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8');
                    fs.createReadStream(p).pipe(res);
                }
            } catch (e) {
                res.statusCode = 404;
                res.end();
            }
        }
    }
    start() {
        let { port, hostname } = this.config;
        let server = http.createServer(this.handleRequest());
        let url = `http://${hostname}:${chalk.green(port)}`;
        debug(url);
        server.listen(port, hostname);
    }
}
let server = new Server();
server.start();