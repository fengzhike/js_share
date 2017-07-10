let  mongoose = require('mongoose')//引入mongoose
// let DBaddress = require('../config.js')
let DB_URL = 'mongodb://112.74.184.170:27017/blog'//定义链接mongoose的地址
mongoose.connect(DB_URL)//创建mongoose链接
module.exports = mongoose//导出刚刚创建的mongoose