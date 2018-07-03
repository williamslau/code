module.exports = (options, app) => {
    return async function (ctx, next) { // Ctx上下文， next就是执行下一层
        const start =Date.now();
        await next();
        console.log(options.prefix + (Date.now() - start) + 'ms');
    }
}