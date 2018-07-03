const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
module.exports = function (config, env) {
    // 在这里可以执行对cnfig的修改
    // 1.向原来的webpack配置的babel插件列表中增加一个插件，按需导入 babel-plugin-import
    // pabel-plugin-add
    // config = injectBabelPlugin(['import', {libraryName: 'antd', style: true}], config);
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: "css" }], config);
    // 增加了对less的loader支持
    // 相当于：
    // {
    //    test:/\.less$/,
    //    use:['style-loader','css-loader','less-loader]
    // }
    config = rewireLess.withLoaderOptions({
        modifyVars: {"@primary-color": "#1f2d3d"},
    })(config, env);
    return config;
}