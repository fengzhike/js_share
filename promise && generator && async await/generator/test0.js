"use strict";
function* gen() {
    yield 1;
    yield 2;
}

var it = gen();
console.log(it);        
console.log(it.next());  
console.log(it.next());  
console.log(it.next()); 

/*
　这个玩意儿如果运行的话，会返回一个Iterator实例， 然后再执行Iterator实例的next()方法， 
那么这个函数才开始真正运行， 并把yield后面的值包装成固定对象并返回，直到运行到函数结尾， 最后再返回undefined；
*/


function* aa(){
	yield 1
}