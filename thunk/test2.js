var fs =  require('fs')
var fileName = './test2.txt'


// 正常版本的readFile（多参数版本）
fs.readFile(fileName, 'utf8', (err,data)=>console.log(data));

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName){
  return function (callback){
    return fs.readFile(fileName,'utf8', callback); 
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk((err,data)=>console.log(data));

/*
JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。
在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。

上面代码中，fs 模块的 readFile 方法是一个多参数函数，两个参数分别为文件名和回调函数。
经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。

*/
