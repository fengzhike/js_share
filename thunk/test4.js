var thunkify = require('thunkify');
var fs = require('fs');
var fileName = './test2.txt'

var read = thunkify(fs.readFile);
read(fileName,'utf8')(function(err, str){
  console.log(str)
});

/*
缺少依赖项目可以直接npm instal thunkify来安装
生产环境的转换器，建议使用 Thunkify 模块。
*/