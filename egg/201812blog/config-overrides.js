const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
module.exports = function (config, env) {
    //向原来的webpack配置的babel插件列表中增加一个插件，按需导入。babel-plugin-import 
    //babel-plugin-abc
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    //增加了对less的loader支持

    config = rewireLess.withLoaderOptions({
        modifyVars: { "@primary-color": "#1DA57A" },
    })(config, env);
    return config;
}
// {
//     test: /\.less$/,
//         use: ['style-loader', 'css-loader', 'less-loader']
// }