// node是单线程语言，但是集成了子进程模块 child_process
// 可以创建一个进程为我们服务，不会影响node的事件环
// 所以node是一门多进程语言
// 多核cpu如果node只开一个进程，就只会占用一个cpu
// node里一个进程只有一个线程
// 集群
// 查看服务器cpu个数
let os = require('os');
console.log(os.cpus().length);

// 创建一个子进程，复杂在进程之间的通信
// child_process 的方法有
// spawn 生产
// fork 叉子
// exec 执行
// execFile 执行文件

// spawn 生产
let { spawn } = require('child_process');
let path = require('path');
// spawn(命令,[参数],{cwd:工作目录}) node aa.js
let child = spawn('node', ['1.test.js', 'a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro'),       //current working directory
    // stdio:'inherit',            // 继承父进程    默认stdio:['pipe'] 管道类型
    // stdio:[process.stdin,process.stdout,process.stderr],
    //stdio:[0,1,2],
});
// 
// 主进程里有三个东西
// process.stdin    0   标准输入
// process.stdout   1   标准输出
// process.stderr   2   错误输出
child.stdout.on('data', function (data) {
    console.log(data.toString());
});
child.on('exit', function () {     // 进程退出（进程执行完了）
    console.log('exit');
});

child.on('close', function () {    // 进程关闭，会在exit之后执行
    console.log('close');
});

child.on('error', function (err) {      // 错误
    console.log(err);
});

// 建立三个进程，（主进程）创建两个进程
// 将第一个进程中的参数传入第二个进程中
// 再在第二个进程中写入到文件中
let { spawn } = require('child_process');
let path = require('path');
let child2 = spawn('node', ['2.test.js', 'a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro')
});
let child3 = spawn('node', ['3.test.js', 'a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro')
});

child2.stdout.on('data', function (data) {
    child3.stdout.write(data);
});


// 上述方案比较啰嗦，好方案是创建进程之间的通信
// ipc inter-Process_Communication
let { spawn } = require('child_process');
let path = require('path');
let child = spawn('node', ['ipc.js'], {
    cwd: path.join(__dirname, 'pro'),
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});
child.send({ name: 'willianlau' });
child.on('message', function (data) {
    console.log(data);
    child.kill(); // 杀死进程
});
// ignore 不要子进程数据
// pipe 建立管道
// null
// ipc  支持ipc通信

// 现在是主进程控制，还可以子进程控制自己关闭
// detach 主进程放弃控制权
// unref() 将主进程关掉
let { spawn } = require('child_process');
let path = require('path');
let fd = require('fs').openSync(path.join(__dirname, '100.txt'), 'w');
let child = spawn('node', ['detach.js'], {
    cwd: path.join(__dirname, 'pro'),
    stdio: ['ignore', fd, 'ignore'],    // 会自动将描述符包装成可写流
    detached: true,
});
child.unref();

// fork 默认支持ipc的方法
let { fork } = require('child_process');
let path = require('path');
let child = fork('fork.js', ['a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro'),
    silent: false   // 是否打印子进程的cosole 这句话的意思就是 ['ignore','ignore','ignore','ipc']
});
child.send('hello');

// 用spawn模拟fork
let { spawn } = require('child_process');
let path = require('path');
function fork(modulePath, args, options = {}) {
    if (options.silent) {
        options.stdio = ['ignore', 'ignore', 'ignore', 'ipc'];
    } else {
        options.stdio = [0, 1, 2, 'ipc']
    }
    return spawn('node', [modulePath, ...args], options);
}
let child = fork('fork.js', ['a', 'b', 'c'], {
    cwd: path.join(__dirname, 'pro'),
    silent: false
});
child.send('hello');



// 配合http
// http.js
// 使用client.js测试
let { fork } = require('child_process');
let path = require('path');
let http = require('http');
let child = fork('http.js', {
    cwd: path.join(__dirname, 'pro')
});
let server = http.createServer(function (req, res) {
    res.end('父进程接收数据请求');
});
server.listen(3000);
child.send('hello', server);

// 监听socket  使用net模块
// 使用puTTY测试 Raw Always
let { fork } = require('child_process');
let path = require('path');
let net = require('net');
let child = fork('socket.js', {
    cwd: path.join(__dirname, 'pro')
});
let server = net.createServer(function (socket) {
    if (Math.random() > 0.5) {
        socket.write('父进程接收数据请求');
    } else {
        child.send('socket', socket);
    }
});
server.listen(3000);


// execFile
// 执行文件

let { execFile } = require('child_process');
execFile('node', ['-v'], {
    maxBuffer: 100
}, function (err, stdout, stderr) {
    console.log(stdout);
});

// exec
// 执行命令

let { exec } = require('child_process');
exec('ls -l', function (err, stdout, stderr) {
    console.log(stdout);
});

// 打开一个localhost
let { exec } = require('child_process');
exec('start http://localhost:3000');


// 集群
// 方法介绍
let cluster = require('cluster');
// cluster.isMaster 判断是不是主线程
// cluster.fork() 创建子进程
if (cluster.isMaster) {
    // 在主分支中可以创建子进程
    let worker = cluster.fork();
    console.log('父进程');
} else {
    console.log('子进程');
    // process.exit();         // 当前进程的退出方法
    // process.distonnect()    // 断开链接
}
cluster.on('fork', function (worker) { // 监听子进程
    console.log(worker.id);
});
cluster.on('disconnect', function () {
    console.log('断开链接');
});
cluster.on('exit', function () {       // 监听关闭子进程
    console.log('退出');
});

// 集群
// 使用client.js测试
let cluster = require('cluster');
let cpus = require('os').cpus().length;
let http = require('http');
// 根据cpu的核数，创建对应的进程
// 可以根据ipc的方式进行进程之间的通信，默认不支持管道的方式
if (cluster.isMaster) {
    cluster.setupMaster({       //设置启动项
        stdio: 'pipe'
    });
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
} else {
    http.createServer(function (req, res) {
        res.end('ok' + process.pid);
    }).listen(3000);
}

// 父进程和子进程分离
// 使用client.js测试
let cluster = require('cluster');
let cpus = require('os').cpus().length;
let http = require('http');
let path = require('path');
cluster.setupMaster({
    exec: path.join(__dirname,'pro', 'subprocess.js')
});
for (let i = 0; i < cpus; i++) {
    cluster.fork();
}

