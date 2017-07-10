# windows 下搭建java开发环境

## JDK 安装

- 下载地址：http://www.oracle.com/technetwork/java/javase/downloads/index.html

- 点击java download图标
	- ![](./images/1.png)

- 同意协议
	- ![](./images/2.png)

- 选择系统对应版本下载
	- ![](./images/3.png)

## 环境变量配置

系统->高级系统设置->高级->环境变量

- 变量名输入：JAVA_HOME

变量值为你的安装路径，我这里填：C:\Program Files\Java\jdk1.8.0_45然后单击"确定"按钮

![](./images/4.png)

- 同样操作我们新建变量：CLASSPATH

变量值：.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\lib\dt.jar

![](./images/5.png)

- 编辑path变量

然后找到Path选项，这个已经存在，单击"编辑"，在最后输入：;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin

![](./images/6.png)

- 现在环境变量配置完毕了，我们可以测试一下，运行cmd，分别输入：java -version，java，javac可以看到结果说明JDK安装并配置完毕。

## 安装Eclips

- 下载地址: http://www.eclipse.org/downloads/

![](./images/7.png)

![](./images/8.png)

## 安装Apache Maven

- 下载地址: https://maven.apache.org/download.cgi

![](./images/9.png)

- 解压

unzip apache-maven-3.3.9-bin.zip

- 在环境变量中，新建M2_HOME，设置为C:\apache-maven-3.3.9

![](./images/10.png)

- 修改path变量，在原值之后添加%M2_HOME%bin;。path变量的取值通过分号进行分隔。

![](./images/11.png)

- maven配置文件复制

![](./images/13.png)

- 保存后大功告成，在命令行输入mvn -v 查看maven是否配置成功

## 安装python

- 下载地址：https://www.python.org/downloads/release/python-360/

- 一路next

- 配置环境变量，安装目录加入path

![](./images/15.png)

## 安装mysql

- 下载地址：https://dev.mysql.com/downloads/installer/

![](./images/14.png)

- 参考安装步骤：http://blog.csdn.net/u013235478/article/details/50623693

- 我的root pwd：a111111

## 下载mysql 客户端SQLyog

- 下载地址：\\192.168.1.202\share\soft\SQLyog

## 代码

### 下载
两个git流，名称必须是devops, rrtimes
- devops:git@192.168.1.209:/opt/devops.git
- rrtimes(切换到开发流):git@192.168.1.209:/opt/rrtimes.git

### 配置
- rrtimes\src\yj\pom.xml
	```xml
			<groupId>com.alibaba</groupId>
			<artifactId>druid</artifactId>
			<version>1.0.23</version> //修改版本
	```

- 执行mvn install

- mysql密码加密

> 生成加密后密码，命令： $ java -cp druid-1.0.23.jar com.alibaba.druid.filter.config.ConfigTools yourPassword

- devops\devops\build\conf\dev\src\rap-user\db.properties
	
用上一步骤生成的密码和公钥修改jdbc.password和jdbc.publickey,修改url的ip为127.0.0.1

- devops\devops\build\conf\dev\src\rrtimes\db.properties
跟上一步一样的修改方式

- devops\devops\ops\server\server-yj-service\conf\db.properties
跟上一步一样的修改方式

- devops\devops\ops\server\server-yj-user\conf\db.properties
跟上一步一样的修改方式

### 编译

- devops\devops\build\build_yj_dev_copy_startAll.bat 

以开发配置编译代码生成package，复制package到server目录并运行易嘉各服务

- devops\devops\build\build_yj_dev.bat

以开发配置编译代码生成package

- devops\devops\build\build_yj_dev_noweb.bat

以开发配置编译后台代码生成package

- devops\devops\ops\copy_dev_inte_restart.bat

复制package并以集中部署模式运行易嘉开发5个进程

- devops\ops\copy_dev_restart.bat           

复制package并以最大分布部署模式运行易嘉，开启10个进程

- devops\ops\stopServer.bat                    

停止服务进程

### 代码调试