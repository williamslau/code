function addA(str) {
    return str + 'A';
}
function addB(str) {
    return str + 'B';
}
function addC(str) {
    return str + 'C';
}
// 把多个函数组合成一个函数
function compose1(...fns) {
    if (fns.length == 0) {
        return (args) => args;
    } else if (fns.length == 1) {
        return (...args) => fns[0](...args);
    } else {
        let last = fns.pop();
        return function (...args) {
            let result = last(...args);

            return fns.reduceRight((val, item) => {
                return item(val);
            }, result)
        }
    }
}
//let compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)));
let compose = (...fns) => {
    console.log('1',fns);
    return fns.reduce((a, b) => {
        console.log('2',a,b);
        return (...args) => {
            console.log('3',args);
            return a(b(...args));
        }
    });
}
let composed = compose(addC, addB, addA);
let r = composed('hello');
// console.log(r);