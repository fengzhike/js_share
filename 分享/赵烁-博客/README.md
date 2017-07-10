# 博客搭建
### 1.服务器环境说明
* 代码管理 GIT
* 自动部署 GIT hooks
* Nginx做端口转发
* Node 应用进程管理 pm2

### 2.后台服务说明
* node Js
* WEB服务express
* 数据库mongodb

### 3.前台应用说明
  * 纯react

  ***
  ## 服务器搭建
  * 代码管理这里不过多的介绍大家每天都在用
  * 自动部署 GIT hooks，当执行完客户端推送的消息之后开始自动部署，服务端钩子post-receive钩子介绍：
     > post-receive 挂钩在整个过程完结以后运行，可以用来更新其他系统服务或者通知用户。 它接受与 pre-receive 相同的标准输入数据。 它的用途包括给某个邮件列表发信，通知持续集成（continous integration）的服务器，或者更新问题追踪系统（ticket-tracking system） —— 甚至可以通过分析提交信息来决定某个问题（ticket）是否应该被开启，修改或者关闭。 该脚本无法终止推送进程，不过客户端在它结束运行之前将保持连接状态，所以如果你想做其他操作需谨慎使用它，因为它将耗费你很长的一段时间。

      * post-receive钩子脚本如下
      ```shell
      #!/bin/bash
      #实现前端代码自动化部署
      #LOGFILE=./post-receive.log
      echo "=================================================================================" >> /home/git/auto.txt
      echo -e "GIT钩子响应开始 $( date )" >> /home/git/auto.txt
      echo "开始切换到项目目录下" >> /home/git/auto.txt
      cd /home/git/myapp &&
      echo "切换到项目目录成功" >> /home/git/auto.txt
      echo "开始从服务器端拉取最新的代码" >> /home/git/auto.txt
      unset GIT_DIR
      git pull origin master >>/home/git/auto.txt &&
      echo "代码拉取成功" >> /home/git/auto.txt
      #/home/git/.nvm/versions/node/v7.4.0/bin/node /home/git/.nvm/versions/node/v7.4.0/bin/npm update &&
      #echo "安装所需的依赖成功" >> /homo/git/auto.txt &&
      /home/git/.nvm/versions/node/v7.4.0/bin/node /home/git/.nvm/versions/node/v7.4.0/bin/webpack >> /home/git/quto.txt &&
      echo "打包完毕" >> /home/git/auto.txt &&
      /home/git/.nvm/versions/node/v7.4.0/bin/node /home/git/.nvm/versions/node/v7.4.0/bin/pm2 stop all >> /home/git/auto.txt &&
      echo "关闭所有Node服务成功" >> /home/git/auto.txt &&
      /home/git/.nvm/versions/node/v7.4.0/bin/node /home/git/.nvm/versions/node/v7.4.0/bin/pm2 start server.js -n server >> /home/git/auto.txt &&
      echo "启动当前Node服务成功" >> /home/git/auto.txt &&
      echo -e "自动部署全部完成 $( date )" >> /home/git/auto.txt &&
      echo "=================================================================================" >> /home/git/auto.txt
      ```
  * Nginx 配置
  >  配置文件 /etc/nginx/nginx.conf 将服务器的80端口转发至本机的8088端口

  ```javascript
  http {

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;
        gzip on;
        gzip_disable "msie6";
        include       mime.types;
        default_type  application/octet-stream;
        sendfile        on;
        keepalive_timeout  65;
        server {
            listen       80;
            server_name  127.0.0.1:8088;
            location / {
                proxy_pass   http://127.0.0.1:8088;
            }
        }
    }

  ```
  > node 可以起后台服务为什么还要用nginx起服务再转发？

  * Node 进程管理

    大家都知道启动一个node程序一般都要占用一个命令窗口，当窗口被关闭node进程也会随之关闭。当然还有nohup形式，也就是后台执行node程序不占用窗口，通常写法如下：

      > node server.js & //这个不太靠谱，经常默默的进程在后台就挂了

    * pm2 PM2是具有内置负载平衡器的Node.js应用程序的生产流程管理器。它允许您永远保持应用程序的活动.
      ```
       安装：npm install -g pm2
       启动程序：pm2 start <app_name|id|all>
       列举进程：pm2 list
       退出程序：pm2 stop <app_name|id|all>
       重起应用：pm2 restart
      ```
  ***
  ## 后台服务
  * express server.js
  ```javascript
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
  app.get('/*',(req,res)=>{//request response
  	res.send('您好，您没有权限访问该页面')
  })
  //app.get('/', function (req, res) {
    //res.send('Hello World!');
  //})
  // POST 请求
  //app.post('/', function (req, res) {
    //res.send('Got a POST request');
  //})
  // PUT 请求
  //app.put('/user', function (req, res) {
    //res.send('Got a PUT request at /user');
  //})
  // DELETE 请求
  //app.delete('/user', function (req, res) {
    //res.send('Got a DELETE request at /user');
  //})
  app.use('/blogs',require('./nodeServer/routes/blogs.js'))//路由控制器
  //开启时服务器的端口号
  app.listen(8088)
  ```
  > nodeServer/routes/blogs.js

  ```javascript
  //定义一个接口实例
  router.post('/insert', (req, res) => {
      res.header("Access-Control-Allow-Origin", "*")
      let obj = req.body
      //用Model创建Entity
      var user = new User({
          title: obj.title,
          author: obj.author,
          class: obj.class,
          createTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          abstract:obj.abstract,
          content:obj.content
      });
      let re = res
      user.save(function(err, res) {
          if (err) {
              re.json({ result: false, value: err })
          } else {
              re.json({ result: true, value: true })
          }
      })
  })
  ```
  * mongose
    * 名词解释
      * Schema  ：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
      * Model   ：  由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
      * Entity  ：  由Model创建的实体，他的操作也会影响数据库
    > Schema、Model、Entity的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。

      ```javascript
      //db.js 只负责链接数据库
      let  mongoose = require('mongoose')//引入mongoose
      let DB_URL = 'mongodb://112.74.184.170:27017/blog'//定义链接mongoose的地址
      mongoose.connect(DB_URL)//创建mongoose链接
      module.exports = mongoose//导出刚刚创建的mongoose
      ```
    * 创建Schema 和 Model
      ```javascript
      let  db = require('../db.js')
      //定义一个Schema数据库原型
      var Schema = db.Schema;
      var UserSchema = new Schema({          
          title : { type: String },                    //标题
          author: {type: String},                        //作者
          class: {type: String},                        //分类
          createTime : { type: String},                      //创建时间
          abstract : { type: String},                      //摘要
          content : { type: String}                       //内容
      });
      //将该Schema发布为Model
      module.exports = db.model('User',UserSchema);
      ```
      * 用Model 创建 Entity
      ```javascript
      router.post('/insert', (req, res) => {
          res.header("Access-Control-Allow-Origin", "*")
          let obj = req.body
          //用Model创建Entity
          var user = new User({
              title: obj.title,
              author: obj.author,
              class: obj.class,
              createTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
              abstract:obj.abstract,
              content:obj.content
          });
          let re = res
          user.save(function(err, res) {
              if (err) {
                  re.json({ result: false, value: err })
              } else {
                  re.json({ result: true, value: true })
              }
          })
      })
      ```
      * Entity对数据库进行CRUD操作
        * 查询
          * Entity.find({})
          * Entity.findOne({})
        * 新增
          * Entity.save()
        * 修改
          * Entity.update()
          ```javascript
          Entity.findById(id,function(err,data){
              data.name = 'MDragon';
              var _id = person._id; //需要取出主键_id
              delete person._id;    //再将其删除
              Entity.update({_id:_id},data,function(err){});
              //此时才能用Model操作，否则报错
          });
          ```
          > update第一个参数是查询条件，第二个参数是更新的对象，但不能更新主键，这就是为什么要删除主键的原因。
        * 删除
          * Entity.remove()
  ***
  ## 前台 react
    * 看时间而定，有时间直接看代码
  ***
  ## 遗留问题
    * 在webpack打包的时候如何将业务代码和第三方的库分离，实现按需加载？
    * 有没有一个好点的markdown编辑器，可以用在react上？
