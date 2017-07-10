var fs =  require('fs')
var fileName = './test2.txt'

var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

var readFileThunk = Thunk( fs.readFile);
readFileThunk(fileName, 'utf-8')((err,data)=>console.log(data));

/*
任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。下面是一个简单的 Thunk 函数转换器。
*/