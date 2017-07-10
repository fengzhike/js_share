// express比较流行的web服务器
let express = require('express')
//将所有以post请求过来的参数都转换成json对象
let bodyParser = require('body-parser')
// 执行express服务器
let app = express()
// 监听所有的静态文件请求，将所有的静态文件请求执行/app
app.use(express.static(__dirname + '/app'))
app.use(bodyParser.urlencoded({
	extended:false
}))
//将所有以post请求过来的参数都转换成json对象
app.use(bodyParser.json())
//监听/目录的请求
app.get('/*',(req,res)=>{
	res.send('您好，您没有权限访问该页面')
})
app.use('/blogs',require('./nodeServer/routes/blogs.js'))
//开启时服务器的端口号
app.listen(8088)