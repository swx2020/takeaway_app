// 原vue项目中的config.js文件以及build文件夹中的相关数据可以在新建的vue.config.js中定义
module.exports = {
  configureWebpack: {
    // 配置路径
    resolve: {
      // 配置别名
      alias: {
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        views: '@/views',
        network: '@/network'
      }
    }
  },
  // webpack-dev-server相关配置
  devServer: {
    // 代理服务器
    proxy: 'http://localhost:3000'
  }
};
