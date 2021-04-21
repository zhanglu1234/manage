
module.exports = {
    publicPath: './',

    devServer: {
        open: true, //浏览器自动打开页面
        host: "localhost", //如果是真机测试，就使用这个IP
        port: 8082,
        https: false,
        hotOnly: false, //热更新（webpack已实现了，这里false即可）
        proxy: {
            "/": {
                target: "http://localhost:9999/", // 需要跨域的目标url
                changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
                ws: true, // proxy websockets
                pathRewrite: { //重写路径
                    '^/': '/' //代理路径
                }
            },
        }
    }
}