
// egg.js是基于koa封装的一个框架
// router其实就是路由中间件的router实例，可以在他身上定义路由规则
// controller 控制器 
// app.get('/',function(){});
// 1.controller={}
// 2.得到HomeController,然后创建它的实例
// 3.controller.home=home;
module.exports = (app) => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/news', controller.news.index);
}