const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    // 代理
    devServer: {
        proxy: {
            // 直接使用 /api 开头的 URL 而不必担心跨域问题
            // 将以 api 开头的 URL 映射到 http://localhost:8888
            '/api': {
                target: 'http://localhost:8888', // 设置代理目标地址
                changeOrigin: true // 更改请求头中的Origin为目标地址,以便服务器可以正确处理跨域请求
                // pathRewrite: {
                //   '^/api': ''
                // }
            }
        }
    }
});
