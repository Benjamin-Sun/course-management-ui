const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      // 以/api开头的请求会被代理
      '/api': {
        // 目标代理服务器地址
        target: 'http://localhost:9800',
        // 允许跨域
        changeOrigin: true,
        // 重写路径，将/api替换为空字符串
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};