const path = require('path')
module.exports = {
    // // 项目路径
    publicPath: '/',
    // // 输出目录
    outputDir: 'build',
    // // 静态资源路径
    // assetsDir: undefined,
    // runtimeCompiler: true,
    productionSourceMap: false,
    filenameHashing: true,
    // parallel: undefined,
    css: {
        loaderOptions: {
            css: {
                
            },
            postcss: {
                exclude: [
                    path.resolve(__dirname, "./src/assets/css/")
                ],
                // 这里的选项会传递给 postcss-loader
            }
        }
    },
    // 开发环境
    devServer: {
        proxy: {
            '/apis': {
                target: "xxx",
                changeOrigin: true,
                pathRewrite: {
                    '^/apis': ''   //需要rewrite的,
                }
            },
            "/wximg": {
                target: "http://thirdwx.qlogo.cn",
                changeOrigin: true,
                pathRewrite: {
                    '^/wximg': ''   //需要rewrite的,
                }
            },
            '/webapi': {
                target: "xxx",
                changeOrigin: true,
                pathRewrite: {
                    '^/webapi': ''   //需要rewrite的,
                }
            },
        }
    },  
    chainWebpack: config => {
        config.module
            .rule('less')
                .oneOf('vue')
                .use('px2rem-loader')
                .loader('px2rem-loader')
                .before('postcss-loader')
                .options({ remUnit: 100 })
                .end()
        config.module
            .rule('css')
                .test(/\.css$/)
                .oneOf('vue')
                .resourceQuery(/\?vue/)
                .use('px2rem')
                .loader('px2rem-loader')
                .options({
                    remUnit: 100
                })
    }
}