/**
 * Created by shuoer on 2016/7/18.
 */
var webpack = require('webpack')
var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin');
var projectRootPath = path.resolve(__dirname, './');
module.exports = {
    // devtool: 'eval-source-map',
    entry:'./src/app.js',//需要打包的主入口文件
    output:{
        path:'./app/',//打包后的文件夹
        filename:'play.js'//打包后的文件名称
    },
    module:{
        loaders:[//loader加载器
            {
                test:/\.css$/,//用于加载CSS文件
                loaders:["style","css"],//配置CSS需要加载的两个加载器
                exclude:"/node-modules/"//排除不需要加载的文件夹
            },{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders:['react-hot','babel']
            },{
                test: /\.less$/, 
                loader: "style!css!less"
            },{
                test: /\.(jpg|png|svg|woff|woff2)$/,
                exclude: /node_modules/,
                loader: "url-loader?limit=8192" //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            },{
                test: /\.json$/,
                loader: "json-loader"
            }

        ]
    },
    resolve:{//定义文件名称，以后webpack会自动去查找文件后缀
        extensions:['','.css','.js','.jsx','.less'],
        alias:{
            utils:path.resolve(projectRootPath, './src/utils/fetch-wrapper/index.js')
        }
    },
    devServer: {
        contentBase: './app/',
        hot: true,
        proxy: {
            '/blogs/*': 'http://112.74.184.170/'//阿里云服务器
        }
    },
    plugins:[
        new htmlWebpackPlugin({
            title:"My play react app",
            template:'src/index.html',
            inject:'body'
        })
    ]
}