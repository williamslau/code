'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.post('/api/users/signup', controller.users.signup);
    router.post('/api/users/signin', controller.users.signin);
    router.get('/api/users/signout', controller.users.signout);

    router.resources('categories', '/api/categories', controller.categories);
    // router.get('/api/categories', controller.categories.index);
    // router.post('/api/categories', controller.categories.create);
    // router.put('/api/categories/:id', controller.categories.update);
    // router.delete('/api/categories/:id', controller.categories.delete);
    router.resources('classifies', '/api/classifies', controller.classifies);

    router.resources('articles', '/api/articles', controller.articles);
    router.get('/api/articles/pv/:id', controller.articles.addPv);
    router.post('/api/articles/comment/:id', controller.articles.addComment);
    router.delete('/api/articles/:article_id/comment/:comment_id', controller.articles.removeComment);
    // 前端接口
    // 获取文章列表
    router.get('/api/list/getList', controller.list.getList);
    // 获取最新文章
    router.get('/api/list/getNewList', controller.list.getNewList);
    // 获取所有标签
    router.get('/api/list/getCategory', controller.list.getCategory);
    // 获取文章内容
    router.post('/api/articles/getArticles/:id', controller.articles.getArticles);
};
