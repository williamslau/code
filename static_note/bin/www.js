#! /usr/bin/env node

// 解析process.argv （命令行参数）
let yargs = require('yargs');
let os = require('os');                     // 操作系统
let { exec } = require('child_process');    // 执行命令行命令
// console.log(process.argv);
let argv = yargs.options('p', {
    alias: 'port',   // 别名  --后面的
    default: 5000,   // 默认值
    demaud: false,   // 是否必填
    type: Number,    // 类型
    description: '端口号'   // 注释  --help以后会显示
}).options('o', {
    alias: 'hostname',
    default: 'localhost',
    demaud: false,
    type: String,
    description: '主机'
}).options('d', {
    alias: 'dir',
    default: process.cwd(),     //当前的工作命令
    demaud: false,
    type: String,
    description: '执行目录'
}).usage('usage:william-server [options]')    // --help中的首行使用说明
    .alias('h', 'help')                            // help的别名
    .example('william-server --port 3000')        // --help中的行尾使用例子
    .argv;
let Server = require('../src/app');
let server = new Server(argv);
// 需要执行start http://localhost
server.start();
// 希望打开浏览器
// william-server --open    执行直接打开就蓝旗
let system = os.platform();
let url = `http://${argv.hostname}:${argv.port}`
if (argv.open) {      // 判断参数
    if (system === 'win32') {
        exec(`start ${url}`);
    } else {
        exec(`open ${url}`);
    }
}
// console.log(argv);




// 实现原理
// let argv = {};
// let args = process.argv.slice(2)
// args.forEach((item,index)=>{
//     if(item.includes('-')){
//         argv[item] = args[index+1];
//     }
// })
// console.log(argv)