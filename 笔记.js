//console

// 标准输出
console.log('log');
console.info('info');

// 错误输出
console.warn('warn');
console.error('error');
// 标准输出 是1表示  错误输出是2表示

// 默认有些属性是隐藏属性,打印隐藏属性
console.dir(Array.prototype, { showHidden: true });

// time 和 timeEnd中的内容是一对 名字相同，相同时才能打印出两段时间的间隔
console.time('label');
for (var i = 0; i < 1000; i++) { }
console.timeEnd('label');

// console.trace()打印函数调用栈 (栈 指的就是代码的调用栈 先进后出 函数调用)
console.log(1);
console.log(2);
function one() {
    var a = 1;
    console.log(a);
    two();
    function two() {
        var b = 2;
        console.log(b)
        three();
        function three() {
            console.log(5);
            console.trace();
        }
    }
}
one();

// console断言  会抛出一个AccertException
console.assert((1 + 3) === 2, 'error');

// process 进程
// argv  后续我们在执行时可能会传递参数 http-server --port 3000
// pid 进程id 端口占用的情况 任务管理器 lsof -i :8080 kill -9 id号
// chdir()  设置工作工作目录(change directory)
process.chdir('..');
// cwd()  当前工作目录(current working directory)
console.log(process.cwd());
// nextTick() 微任务
// nextTick的用法
function Fn() {
    this.arrs;  //此时arrs还不是函数不能执行
    process.nextTick(() => {
        this.arrs();
    })
}
Fn.prototype.then = function () {
    this.arrs = function () { console.log(1) }
}
let fn = new Fn();
fn.then();
// stdout 和console一样(stderr stdin)
process.stdout.write('1');
console.log(1);

//node的宏任务和微任务
// 微任务 
// then  nextTick ( messageChannel mutationObersve)
// nextTick 会比 then快
Promise.resolve().then(function () {
    console.log('then')
})
process.nextTick(function () {
    console.log('nextTick')
});

// 宏任务 
// setTimeout setInterval setImmediate

// 浏览器中 先执行当前栈 执行完走微任务 走事件队列里的内容（拿出一个）放到栈里执行
// 在去执行微任务 
setTimeout(function () {
    console.log('setTimeout1')
    Promise.resolve().then(function () {
        console.log('promise')
    });
})
setTimeout(function () {
    console.log('setTimeout2');
});

// nextTick 和 then 都是在 阶段转化时才会调用
process.nextTick(function () {
    console.log('nextTick')
});
setImmediate(function () {
    console.log('immediate')
});

// timeout immediate 两个谁先执行不一定 取决于node的执行时间
setTimeout(function () {
    console.log('timeout');
})
setImmediate(function () {
    console.log('immediate')
});

// 但是加上i/o文件操作（宏任务）以后就会先执行setImmediate
let fs = require('fs');
fs.readFile('./1.log', function () {
    console.log('fs');
    setTimeout(function () {
        console.log('timeout');
    })
    setImmediate(function () {
        console.log('setImmediate')
    })
});

// 最后的例子
setImmediate(function () {
    console.log(1);
    process.nextTick(function () {
        console.log(4)
    })
})
process.nextTick(function () {
    console.log(2)
    setImmediate(function () {
        console.log(3);
    })
})
// 2 1 3 4

// 模块引入的小坑
module.exports = 'xxx'  //可以使用
exports = 'xxx'           //不可以使用
// 但是可以
exports.x = 'xxx'
// path内部方法  （文件路径处理）
// path.join(xxx,xxx)合并路径
// path.resolve()


// util内部工具方法

// util.promisify()  相当于blueBird 将方法promise化
let fs = require('fs');
let { promisify } = require('util');
let read = promisify(fs.readFile);
read('./1.txt', 'utf8').then(function (data) {
    console.log(data);
});
// 回顾bluebird
let bluebird = require('bluebird');
let fs = require('fs');
let read = bluebird.promisify(fs.readFile);
read('./1.txt', 'utf8').then(function (data) {
    console.log(data);
});

// util.inspect() 没什么实际用处 等价于console.dir();
let util = require('util');
console.log(util.inspect(Array.prototype, { showHidden: true }));

// util.inherits() 继承 只继承共有属性
let util = require('util');
function A() { }
A.prototype.fn = function () {
    console.log(1);
}
function B() { }
util.inherits(A, B);
let b = new A();
b.fn();
// 第一种继承共有属性的方法
A.prototype.__proto = B.prototype;
// 第二种
A.prototype = Object.create(B.prototype);
// 第三种
Object.setPrototypeOf(A.prototype, b.prototype);
// inherite用的第三种

// events 发布订阅
// 小例子
let fs = require('fs');
let path = require('path');
let EventEmitter = require('events');
let events = new EventEmitter();
events.on('getData', function (data) {
    console.log(data);
});
fs.readFile('1.txt', 'utf8', function (err, data) {
    events.emit('getData', data);
});
fs.readFile('2.txt', 'utf8', function (err, data) {
    events.emit('getData', data);
});
// 还有很多暂时搁置



// 截取bom头 在fs.readFileSync()方法里 UTF8格式的文件在字节标识需要删除 EF BB BF  
let fs = require('fs');
function stripBOM(content) {
    if (Buffer.isBuffer(content)) {
        if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
            return content.slice(3);
        }
        return content;
    } else {
        if (content.charCodeAt(0) === oxFEFF) {
            content = content.slice(3);
        }
        return content;
    }
}
let result = fs.readFileSync('./1.txt');
result = stripBOM(result);
console.log(result.toString());

// iconv-lite 解析其他编码的外部方法
let iconv = require('iconv-lite');
let fs = require('fs');
let result = fs.readFileSync('./2.txt');
result = iconv.decode(result, 'gbk');
console.log(result.toString());

// Buffer的乱码问题
let buffer = Buffer.from('珠峰培训');
let buff1 = buffer.slice(0, 5);
let buff2 = buffer.slice(5);
console.log(buff1.toString());
console.log(buff2.toString());
// string_decoder模块解决
let buffer = Buffer.from('珠峰培训');
let buff1 = buffer.slice(0, 5);
let buff2 = buffer.slice(5);
let { StringDecoder } = require('string_decoder');
let sd = new StringDecoder();
console.log(sd.write(buff1).toString());
console.log(sd.write(buff2).toString());
// 模块来解决输出问题 string_decoder 我不识别的不输出 先攒着

// fs模块 fileSystem 文件系统
// 同步性能低，会阻塞线程，能用异步就用异步

// fs.readFile() fs.readFileSync() 读取文件
let fs = require('fs');
fs.readFile('./1.txt', {
    encoding: null,  // 读取文件时候的编码,默认是null,代表的是二进制
    flag: 'r',       // 条件 r读文件 w写文件 a追加写入
}, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

// fs.writeFile() 写入文件
let fs = require('fs');
fs.writeFile('./3.txt', 'aaa', {
    encoding: null,      //默认null(二进制)
    mode: 0o666          //默认权限
}, function (err) {
    console.log(err);
});
// d                    rwx              rwx             rwx       
// -                    421              421             421
// 文件夹为d文件为-       文件所有者权限    文件所属组权限   其他用户

// fs.copyFile() 拷贝文件(node8.5+)
// 小例子（不方便）
let fs = require('fs');
function copy(source, target) {
    fs.readFile(source, 'utf8', function (err, data) {
        if (err) return console.log(err);
        fs.writeFile(target, data, function (err) {
            if (err) return console.log(err);
        });
    });
}
copy('./3.txt', './4.txt');
//用法
let fs = require('fs');
fs.copyFile('./1.txt', './5.txt', function (err) {
    if (err) return console.log(err);
    console.log(111);
});

// fs.open() 打开文件
// flag参数含义
// r 读取文件
// r+ 读取并写入（替换） 
// rs 同步读取文件并忽略缓存
// w 写入文件，不存在则创建，存在则清空
// wx 排他写入文件
// w+ 读取并写入文件，不存在则创建，存在则清空
// wx+ 和w+类似，排他方式打开
// a 追加写入
// ax 与a类似，排他方式写入
// a+ 读取并追加写入，不存在则创建
// ax+ 作用与a+类似，但是以排他方式打开文件
let fs = require('fs');
// fd(file descriptor) 文件描述符 代表对当前文件的描述 从3开始
// process.stdout.write(); // 标准输出  1
// process.stderr.write();// 错误输出 2

// 读
// fs.read()
let buffer = Buffer.alloc(3);
fs.open('./3.txt', 'r', 0o666, function (err, fd) {
    // offset表示的是 buffer从那个开始存储
    // length就是一次想读几个,length不能大于buffer的长度
    // postion 代表的是文件的读取位置，默认可以写null 当前位置从0开始
    fs.read(fd, buffer, 0, 3, null, function (err, bytesRead) {
        // bytesRead读到的个数
        console.log(buffer);
    })
});

// 写
// fs.write()
// 如果flag是a 那你写的position参数就不生效了
let fs = require('fs');
let buffer = Buffer.from('0123456789');
fs.open('./3.txt', 'r+', 0o666, function (err, fd) {
    fs.write(fd, buffer, 0, 5, null, function (err, byteWritten) {
        console.log(byteWritten);
    });
});

// 读写组合
let fs = require('fs');
function copy(source, target) {
    let size = 3;
    let buffer = Buffer.alloc(3);
    fs.open(source, 'r', function (err, rfd) {
        fs.open(target, 'w', function (err, wfd) {
            function next() {
                fs.read(rfd, buffer, 0, size, null, function (err, bytesRead) {
                    if (bytesRead > 0) {
                        fs.write(wfd, buffer, 0, bytesRead, null, function (err, bytesWritten) {
                            next();
                        });
                    } else {
                        fs.close(rfd, function () { });
                        fs.fsync(wfd, function () {
                            fs.close(wfd, function () {
                                console.log('关闭', '拷贝成功');
                            });
                        });
                    }
                })
            }
            next();
        })
    });
}
copy('./3.txt', './4.txt');

// fs.fsync()将缓存区数据强制写入文件
// fs.close()关闭文件

// 文件打开是需要关闭的
let fs = require('fs');
fs.open('./3.txt', 'w', function (err, fd) {
    fs.write(fd, Buffer.from('刘洋志'), 0, 9, 0, function (err, byteswritten) {
        // 当write方法触发了回调函数 并不是真正的文件背写入了，先把内容写入到缓存区
        // 所以现在还不能关闭，要先将缓存区的内容写如后，再关闭文件
        fs.fsync(fd, function () {
            fs.close(fd, function () {
                console.log('关闭');
            });
        })
    });
});
setTimeout(function () {
    fs.open('./3.txt', 'r', function (err, fd) {
        console.log(fd);
    });
}, 1000);

// fs.mkdir() fs.mkdirSync()创建文件夹
// fs.access()判断文件存不存在
// fs.constants.R_OK 文件可被调用进程读取
// fs.constants.W_OK 文件可被调用进程写入

// 同步创建文件夹
let fs = require('fs');
function mkdirp(dir) {
    let paths = dir.split('/');
    for (let i = 1; i <= paths.length; i++) {
        let newPath = paths.slice(0, i).join('/');
        console.log(newPath);
        // 创建目录需要先判断目录存不存在
        try {
            fs.accessSync(newPath, fs.constants.R_OK);
        } catch (e) {
            fs.mkdirSync(newPath);
        }
    }
}
mkdirp('a/b/c/d/e');

// 异步创建文件夹
// 如果是异步的永远不能用for循环，要用next()函数自调用，递归来替代
let fs = require('fs');
function mkdirSync(dir, callback) {
    let paths = dir.split('/');
    function next(index) {
        if (index > paths.length) return callback();
        let newPath = paths.slice(0, index).join('/');
        fs.access(newPath, function (err) {
            if (err) {    // 如果文件不存在就创建这个文件
                fs.mkdir(newPath, function (err) {
                    next(++index);
                });
            } else {
                next(++index);  // 文件夹存在就判断下一个文件夹，递归
            }
        });
    }
    next(1);
}
mkdirSync('a/b/c/d/e', function () {
    console.log('完成');
});

//删除文件夹
// fs.rmdir() fs.rmdirSync() 删除文件夹
// fs.unlink() fs.unlinkSync() 删除文件

// fs.stat('file',function(err, stat){})    读取文件的状态
// stat.isDirectory()方法 判断是不是文件夹
// stat.ifFile()方法 判断是不是文件
// 如果文件夹不存在则会走error

// fs.readdir('file', function(err, files){}) 读取文件夹内容
// 基础用法
let fs = require('fs');
fs.stat('a', function (err, stat) {
    console.log(stat.isDirectory());
    console.log(stat.isFile());
    if (stat.isDirectory()) {
        fs.readdir('a', function (err, files) {
            console.log(files);
        });
    }
});

// 同步删除文件夹 (遗留问题，如果没有传参的文件夹的话会报错)
let fs = require('fs');
let path = require('path');
function removeDir(dir) {
    let files = fs.readdirSync(dir); // 读取内容
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath);
        if (stat.isDirectory()) {
            //如果是文件夹就递归
            removeDir(newPath);
        } else {
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir); //入锅文件夹是空的就把自己删掉
}
removeDir('a');

// 异步删除文件夹 Promise方法
let fs = require('fs');
let path = require('path');
function removePromise(dir) {
    return new Promise(function (resolve, reject) {
        fs.stat(dir, function (err, stat) {
            if (stat.isDirectory()) {
                fs.readdir(dir, function (err, files) {
                    files = files.map(file => path.join(dir, file));
                    files = files.map(file => removePromise(file));
                    Promise.all(files).then(function () {
                        fs.rmdir(dir, resolve);
                    })
                });
            } else {
                fs.unlink(dir, resolve);
            }
        });
    });
}
removePromise('a').then(function () {
    console.log('删除');
});

// 异步删除文件夹 递归方法 深度遍历
let fs = require('fs');
let path = require('path');
function rmdir(dir, callback) {
    fs.readdir(dir, function (err, files) {
        // 读取到文件
        function next(index) {
            if (index === files.length) return fs.rmdir(dir, callback);
            let newPath = path.join(dir, files[index]);
            fs.stat(newPath, function (err, stat) {
                if (stat.isDirectory()) {     // 如果是文件夹
                    rmdir(newPath, () => next(index + 1));
                } else {
                    fs.unlink(newPath, () => next(index + 1));
                }
            });
        }
        next(0)
    });
}
rmdir('a', function () {
    console.log('删除成功');
});

// 广度遍历同步删除文件
// 原理是先创建一个数组，然后吧文件拼接好路径push进去，删除从后往前删除
let fs = require('fs');
let path = require('path');
function preWide(dir, callback) {
    let arrs = [dir];
    let index = 0;
    let current;
    while (current = arrs[index++]) {
        let stat = fs.statSync(current);
        if (stat.isDirectory()) {
            let files = fs.readdirSync(current);
            arrs = [...arrs, ...files.map(file => {
                return path.join(current, file);
            })];
        }
    }
    for (let i = arrs.length - 1; i >= 0; i--) {
        let stat = fs.statSync(arrs[i]);
        if (stat.isDirectory()) {
            fs.rmdirSync(arrs[i]);
        } else {
            fs.unlinkSync(arrs[i]);
        }
    }
}
preWide('a');

// 异步广度遍历删除文件
let fs = require('fs');
let path = require('path');
function wide(dir, callback) {
    let arrs = [dir];
    let index = 0;
    function rmdir() {
        if (index === 0) return callback()
        let current = arrs[--index];
        fs.stat(current, function (err, stat) {
            if (stat.isDirectory()) {
                fs.rmdir(current, rmdir);
            } else {
                fs.rmdir(current, rmdir);
            }
        });
    }
    function next() {
        if (index === arrs.length) return rmdir()
        let current = arrs[index++];
        fs.stat(current, function (err, stat) {
            if (stat.isDirectory()) {
                fs.readdir(current, function (err, files) {
                    arrs = [...arrs, ...files.map(file => path.join(current, file))]
                    next();
                });
            } else {
                next();
            }
        });
    }
    next();
}
wide('a', function () {
    console.log('删除完毕');
});

// watchFile()监控文件有没有改动
// current是当前状态 prev是上一次的状态

// Date.parse(date) 解析时间
let fs = require('fs');
fs.watchFile('./4.txt', function (current, prev) {
    if (Date.parse(current.ctime) === 0) {
        console.log('创建');
    } else if (Date.parse(prev.ctime === 0)) {
        console.log('删除');
    } else {
        console.log('修改');
    }
});


// fs.rename() 修改文件夹名字
let fs = require('fs');
fs.rename('a', 'b');

//fs.truncate() 截断文件里的内容
let fs = require('fs');
fs.truncate('./4.txt', 5);


//流

// 流的特点 1.是有序的 2.有方向的
// 流分为好多种，常见的 1.可读流 2.可写流
// 对文件的操作用的也是fs模块


// fs.createReadStream() 创建一个可读流 返回的是一个可读流对象
// rs.on('data',function(data){}) 触发流动状态
// rs.pause() 暂停data事件的触发 
// rs.resume() 恢复data事件的触发
// rs.on('end',function(data){}) 暂停
// rs.on('open',function(data){}) 打开文件
// rs.on('close',function(data){}) 关闭文件
// rs.on('error',function(data){}) 如果有错误会会触发
// rs.setEncoding('utf8'); 将编码设置为utf8,设置编码


// 可读流的用法
let fs = require('fs');
let path = require('path');
let rs = fs.createReadStream(path.join(__dirname, '1.txt'), {
    flags: 'r', // 文件的操作是读取操作
    encoding: 'utf8', // 默认是null null代表的是buffer
    autoClose: true, // 读取完毕后自动关闭
    highWaterMark: 3,// 默认是64k  64*1024b
    start: 0, // 123 456 789  从0开始读
    //end:3 // 包前又包后 读到3
});

// 默认情况下不会将文件中的内容输出
// 内部会先创建一个Buffer先读取3b(三字节)
// 如果你不进行操作，默认是非流动模式，暂停状态，要事件触发rs.on('data',function(data){})
// 流动模式会疯狂的触发data事件
rs.on('data', function (data) {
    console.log(data);
    //读取

});

rs.pause(); // 暂停方法 表示暂停读取，暂停data事件触发

rs.resume() // 恢复data事件的触发

rs.on('end', function () {
    console.log('暂停')
});

rs.on('open', function () {
    console.log('文件打开')
});

rs.on('close', function () {
    console.log('关闭')
});

rs.on('error', function (err) {
    console.log(err);
    //错误
});

rs.setEncoding('utf8'); //将编码设置为utf8

// 可读流的封装
//this.on('newListener', (eventName, callback) => {}); 判断是否监听某个事件

let fs = require('fs');
let path = require('path');
let EventEmitter = require('events');

class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.flags = options.flage || 'r';
        this.autoClose = options.autoClose || true;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.start = options.start || 0;
        this.end = options.end;
        this.encoding = options.encoding || null;
        this.flowing = null; // 用来监听data事件，null就是暂停模式（非流动模式）
        this.buffer = Buffer.alloc(this.highWaterMark); // 建立一个buffer 这个buffer就是要一次读多少
        this.pos = this.start; // pos 读取的位置 默认和start一样，但是pos可变，start不变
        this.open();
        this.on('newListener', (eventName, callback) => {
            if (eventName === 'data') { // 判断是否监听data事件
                this.flowing = true;
                this.read(); // 读内容
            }
        });
    }
    // 打开文件的方法
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                this.emit('error', err);
                if (this.autoClose) {   // 判断是否自动关闭
                    this.destroy(); // 关闭方法
                }
                return;
            }
            this.fd = fd; // 保存文件描述符
            this.emit('open');
        })
    }
    // 读取 
    read() {
        if (typeof this.fd !== 'number') {    // 不等于number文件还没打开呢
            return this.once('open', () => this.read()) // 当文件真正打开的时候 会触发open事件，触发事件后再执行read，此时fd肯定有了
        }
        let howMuchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.pos + 1) : this.highWaterMark;
        fs.read(this.fd, this.buffer, 0, howMuchToRead, this.pos, (err, bytesRead) => {
            if (bytesRead > 0) {
                this.pos += bytesRead;
                let data = this.encoding ? this.buffer.slice(0, bytesRead).toString(this.encoding) : this.buffer.slice(0, bytesRead);
                this.emit('data', data);
                if (this.pos > this.end) { // 当读取的位置 大于了末尾 就是读取完毕了
                    this.emit('end');
                    this.destroy();
                }
                if (this.flowing) { // 流动模式继续触发
                    this.read();
                }
            } else {
                this.emit('end');
                this.destroy();
            }
        });
    }
    // pipe方法封装
    pipe(ws) {
        this.on('data', (chunk) => {
            let flag = ws.write(chunk);
            if (!flag) {
                this.pause();
            }
        });
        ws.on('drain', () => {
            this.resume();
        })
    }
    // 关闭（销毁）的方法
    destroy() {
        if (typeof this.fd === 'number') { // 先判断有没有fd, 有就关闭文件，触发close事件
            fs.close(this.fd, () => {
                this.emit('close');
            });
            return;
        }
        this.emit('close'); // 触发close事件
    }
    // 暂停的方法
    pause() {
        this.flowing = false;
    }
    // 恢复的方法
    resume() {
        this.flowing = true;
        this.read();
    }
}

let rs = new ReadStream('./4.txt', {
    flags: 'r',
    encoding: 'utf8',
    autoClose: true,
    highWaterMark: 3,
    start: 0,
    end: 6
});
rs.on('open', function () { console.log('文件打开了') });
rs.on('data', function (data) { console.log('data', data); });
rs.on('error', function (err) { console.log(err); });
rs.on('end', function () { console.log('end') });
rs.on('close', function () { console.log('关闭') });

// pipe 读一点，写一点
let fs = require('fs');
let rs = fs.createReadStream('./3.txt', {
    highWaterMark: 4,
});
let ws = fs.createWriteStream('./4.txt', {
    highWaterMark: 1,
});

rs.on('data', function (chunk) {
    let falg = ws.write(chunk);
    console.log(falg);
    if (!falg) {
        rs.pause();
    }
});
ws.on('drain', function () {
    console.log('干了');
    rs.resume();
})

// rs.pipe(ws); 原生自带pipe 读一点，写一点
let fs = require('fs');
let rs = fs.createReadStream('./3.txt', {
    highWaterMark: 4,
});
let ws = fs.createWriteStream('./4.txt', {
    highWaterMark: 1,
});
rs.pipe(ws);

// 自己封装的pipe
let rs = new ReadStream('./3.txt', {
    highWaterMark: 4,
});
let ws = fs.createWriteStream('./4.txt', {
    highWaterMark: 1,
});
rs.pipe(ws);


// 可写流

// 可写流用法
// fs.createWriteStream() 创建可写流
// ws.write()写入事件（异步的方法）
// ws.write()写入的数据必须是字符串或者Buffer 当文件被清空的时候才会变成true

// ws.on('drain', () => { })抽干方法 当写入完后，会触发
// ws.on('drain', () => { })必须缓存区满了 满了后被清空了才会出发drain

// ws.end() 最后一次写入 当写完后 就不能再继续写了


// 可写流的用法
let fs = require('fs');
let ws = fs.createWriteStream('./4.txt', {
    flages: 'w',     //读写标识符
    mode: 0o666, // 权限
    autoClose: true, // 是否自动关闭
    highWaterMark: 3, // 默认是16k
    encoding: 'utf8', // 编码格式
    start: 0 //从哪开始
});

let i = 9;
function write() {
    let flag = true;
    while (i >= 0 && flag) {
        flag = ws.write(--i + '');
        console.log(flag);
    }
}
write();

ws.on('drain', function () {
    console.log('抽干')
    write();
})

ws.end('ok');


// 可写流的封装

let fs = require('fs');
let EventEmitter = require('events');
class WriteStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark || 16 * 1024;
        this.autoClose = options.autoClose || true;
        this.mode = options.mode;
        this.start = options.start || 0;
        this.flags = options.flags || 'w';
        this.encoding = options.encoding || 'utf8';
        this.buffers = []; // 可写流要有一个缓存区，当正在写入文件是，内容要写入到缓存区中在源码中是一个链表，为了方便，这里用数组
        this.writeing = false;  // 表示是否正在上写入
        this.needDrain = false; // 是否满足触发drain事件
        this.pos = 0; // 记录写入的位置
        this.length = 0; // 记录缓存区的大小

        this.open();

    }
    //打开的方法
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) {
                this.emit(err, err);
                if (this.autoClose) {
                    this.destroy();
                }
                return;
            }
            this.fd = fd;
            this.emit('open');
        });
    }
    // 写入的方法
    write(chunk, encoding = this.encoding, callback = () => { }) {
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
        this.length += chunk.length;
        let ret = this.length < this.highWaterMark;  // 是否达到了缓存区的大小
        this.needDrain = !ret;     // 是否触发needDrain

        if (this.writeing) {    //判断是否正在写入，如果正在写入，就写到缓存区中
            this.buffers.push({
                chunk,
                encoding,
                callback
            });
        } else {
            this.writeing = true;
            this._write(chunk, encoding, () => {    //专门用来将内容写入到文件内的方法发
                callback();
                this.clearBuffer();     //清空缓存区的内容
            });
        }
        return ret;
    }
    // 清空缓存区
    clearBuffer() {
        let buffer = this.buffers.shift();
        if (buffer) {
            this._write(buffer.chunk, buffer.encoding, () => {
                buffer.callback();
                this.clearBuffer();
            });
        } else {
            this.writing = false;
            if (this.needDrain) {
                this.needDrain = false;
                this.emit('drain');
            }
        }
    }
    _write(chunk, encoding, callback) {
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this._write(chunk, encoding, callback));
        }
        fs.write(this.fd, chunk, 0, chunk.length, this.ope, (err, byteWritten) => {
            this.length -= byteWritten;
            this.pos += byteWritten;
            callback();
        });
    }
    // 关闭的方法
    destroy() {
        if (typeof this.fd !== 'number') {
            return this.emit('close');
        }
        fs.close(this.fd, () => {
            this.emit('close');
        });
    }
}
let ws = new WriteStream('./4.txt', {
    highWaterMark: 3,
    autoClose: true,
    flags: 'w',
    encoding: 'utf8',
    mode: 0o666,
    start: 0,
});

let i = 9;
function write() {
    let flag = true;
    while (i > 0 && flag) {
        flag = ws.write(--i + '', 'utf8', () => { console.log('ok') });
        console.log(flag);
    }
}
write();
ws.on('drain', function () {
    console.log('抽干');
    write();
})


// 之前做的可读流是flowing模式（流动模式） 还有一种暂停模式(readable)需要补充

// 可读流暂停模式用法
let fs = require('fs');
let rs = fs.createReadStream('./4.txt', {
    highWaterMark: 3
});
// rs.on('data'); 是流动模式用的 监听以后会一直自动触发
// rs.on('readable',function(){);暂停模式用的 监听以后会先吧缓存区填满，等待着你自己消费
// 回掉中使用rs.read(1)来读取
// rs._readableState.length; // 缓存区的个数
// 当你消费小于 highWaterMark 会自动添加highWaterMark这么多数据
rs.on('readable', function () {
    let result = rs.read(1);
    console.log(result);
    console.log(rs._readableState.length);
});

// LineReader行读取器
// 需求是调取'line'事件后，每次读取一行数据
// 首先每行肯定有一个换行回车
// 在window下 回车是 \r\n 用ASCII表示就是 0x0d 0x0a
// 在mac下 只是 \n 0x0a
let fs = require('fs');
let EventEmitter = require('events');

class LineReader extends EventEmitter {
    constructor(path) {
        super();
        this.RETURN = 0x0d;
        this.LINE = 0x0a;
        this.buffer = [];
        this._rs = fs.createReadStream(path);
        this.on('newListener', (eventName) => {
            if (eventName === 'line') {
                this._rs.on('readable', () => {
                    let char;
                    while (char = this._rs.read(1)) {
                        let current = char[0];
                        switch (current) {
                            case this.RETURN:
                                this.emit('line', Buffer.from(this.buffer).toString());
                                this.buffer.length = 0;
                                // 在window读取\r后 下一个字符可能是\n 如果是的话就吧\n 如果不是就表示他是一个正常的内容
                                let c = this._rs.read(1);
                                if (c[0] !== this.LINE) {
                                    this.buffer.push(c[0]);
                                }
                                break;
                            case this.LINE:
                                this.emit('line', Buffer.from(this.buffer).toString());
                                this.buffer.length = 0;
                                break;
                            default:
                                this.buffer.push(current);
                        }
                    }
                });
                this._rs.on('end', () => {
                    this.emit('line', Buffer.from(this.buffer).toString());
                    this.buffer.length = 0
                });
            }
        });
    }
}

let lineReader = new LineReader('./5.txt');
lineReader.on('line', function (data) {
    console.log(data);
});

// 可读流暂停模式封装

let fs = require('fs');
let EventEmitter = require('events');

function computeNewHighWaterMark(n) {
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
    return n;
}
class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.autoClose = options.autoClose || true;
        this.start = 0;
        this.end = options.end;
        this.flags = options.flags || 'r';
        this.buffers = []; // 缓存区 
        this.pos = this.start;
        this.length = 0; // 缓存区大小
        this.emittedReadable = false;
        this.reading = false; // 是不是正在读取的

        this.open();
        this.on('newListener', (eventName) => {
            if (eventName === 'readable') {
                this.read();
            }
        })
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                this.emit('error', err);
                if (this.autoClose) {
                    this.destroy();
                }
                return
            }
            this.fd = fd;
            this.emit('open');
        });
    }
    read(n) {
        if (n > this.length) {
            // 更改缓存区大小  读取五个就找 2的几次放最近的
            this.highWaterMark = computeNewHighWaterMark(n)
            this.emittedReadable = true;
            this._read();
        }

        //如果n>0有值了，就是外面传的，去缓存区取
        let buffer = null;
        let index = 0; // 维护buffer的索引的
        let flag = true;
        if (n > 0 && n <= this.length) {
            //在缓存区中取
            buffer = Buffer.alloc(n);
            let buf;
            while (flag && (buf = this.buffers.shift())) {
                for (let i = 0; i < buf.length; i++) {
                    buffer[index++] = buf[i];
                    if (index === n) {
                        flag = false;
                        this.length -= n;
                        let bufferArr = buf.slice(i + 1); // 取出留下的部分
                        if (bufferArr.length > 0) { // 如果有剩下的内容 再放入到缓存中
                            this.buffers.unshift(bufferArr);
                        }
                        break;
                    }
                }
            }

        }
        // 当前缓存区 小于highWaterMark时在去读取
        if (this.length === 0) {
            this.emittedReadable = true;
        }
        if (this.length < this.highWaterMark) {
            if (!this.reading) {
                this.reading = true;
                this._read(); // 异步的
            }
        }
        return buffer;
    }
    // 自己封装的读取的方法
    _read() {
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this._read());
        }
        let buffer = Buffer.alloc(this.highWaterMark);
        fs.read(this.fd, buffer, 0, buffer.length, this.pos, (err, bytesRead) => {
            if (bytesRead > 0) {
                // 默认读取的内容放到缓存区中
                this.buffers.push(buffer.slice(0, bytesRead));
                this.pos += bytesRead;  //维护读取的索引
                this.length += bytesRead; //维护缓存区的大小
                this.reading = false;
                // 是否需要触发readable事件

                if (this.emittedReadable) {
                    this.emittedReadable = false;
                    this.emit('readable');
                }
            } else {
                this.emit('end');
                this.destroy();
            }
        });
    }
    destroy() {
        if (typeof this.fd !== 'number') {
            return this.emit('close');
        }
        fs.close(this.fd, () => {
            this.emit('close');
        });
    }
}
let rs = new ReadStream('./5.txt', {
    flags: 'r',
    autoClose: true,
    encoding: 'utf8',
    start: 0,
    highWaterMark: 3
});
rs.on('readable', function () {
    let result = rs.read(3);
    console.log(result);
});

// 自定义流
// 读
let { Readable } = require('stream');
// 想实现什么流 就继承这个流
// Readable里面有一个read()方法，默认掉_read()
// Readable中提供了一个push方法你调用push方法就会触发data事件
let index = 9;
class MyRead extends Readable {
    _read() {
        // 可读流什么时候停止呢？ 当push null的时候停止
        if (index-- > 0) return this.push('123');
        this.push(null);
    }
}
let mr = new MyRead;
mr.on('data', function (data) {
    console.log(data);
});

// 写
let {Writable} = require('stream');
// 可写流实现_write方法
// 源码中默认调用的是Writable中的write方法
class MyWrite extends Writable{
    _write(chunk,encoding,callback){
        callback(); // clearBuffer
    }
}
let mw = new MyWrite();
mw.write('珠峰','utf8',()=>{
    console.log(1);
})
mw.write('珠峰','utf8',()=>{
    console.log(1);
});


// 双工流 又能读 又能写，而且读取可以没关系(互不干扰);
let {Duplex} =  require('stream');
let d = Duplex({
    read(){
        this.push('hello');
        this.push(null)
    },
    write(chunk,encoding,callback){
        console.log(chunk);
        callback();
    }
});
d.on('data',function(data){
    console.log(data);
});
d.write('hello');


// tranform流（转化流）
// 他就是duplex 他不需要实现read write,实现的叫transform
// 他的参数和可写流一样

// 需要命令行运行
let {Transform} =  require('stream');

let tranform1 = Transform({
    transform(chunk,encoding,callback){
        this.push(chunk.toString().toUpperCase()); // 将输入的内容放入到可读流中
        callback();
    }
});
let tranform2 = Transform({
    transform(chunk,encoding,callback){
        console.log(chunk.toString());
        callback();
    }
});
// 等待你的输入
// rs.pipe(ws);
// 希望将输入的内容转化成大写在输出出来
process.stdin.pipe(tranform1).pipe(tranform2);
// 对象流 可读流里只能放buffer或者字符串 对象流里可以放对象
// 输入以后转化以后再输出