# 异步编程

## 为啥要异步编程
- 异步编程对 JavaScript 语言太重要。JavaScript 只有一根线程，如果没有异步编程，根本没法用，非卡死不可

## 异步编程的方法

- 异步编程的语法目标，就是怎样让它更像同步编程
- 大概有下面四种
	- 回调函数
	- 事件监听
	- 发布/订阅
	- Promise 对象


## 所谓"异步"

- 简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段
- 就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数
- 例如:请求文件->其他任务->处理文件
	
	```javascript
		fs.readFile('/etc/passwd', function (err, data) {
		  if (err) throw err;
		  console.log(data);
		});
	```

## 所谓回调函数

- 回调函数嵌套,很多很出现"回调函数噩梦"（callback hell)

	```javascript
		fs.readFile(fileA, function (err, data) {
		  fs.readFile(fileB, function (err, data) {
		    // ...
		  });
		});
	```

## Promise
- Promise就是为了解决这个问题而提出的。允许将回调函数的横向加载，改成纵向加载。
	
	```javascript
		var readFile = require('fs-readfile-promise');
		readFile(fileA)
		.then(function(data){
		  console.log(data.toString());
		})
		.then(function(){
		  return readFile(fileB);
		})
		.then(function(data){
		  console.log(data.toString());
		})
		.catch(function(err) {
		  console.log(err);
		});
	```

## 协程
- 传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做"协程"（coroutine），意思是多个线程互相协作，完成异步任务
- 协程有点像函数，又有点像线程。它的运行流程大致如下
	- 第一步，协程A开始执行。
	- 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
	- 第三步，（一段时间后）协程B交还执行权。
	- 第四步，协程A恢复执行。

- 跟子例程相似，是一种程序控制机制；允许多个入口，可以指定位置挂起和恢复执行。本地数据在后续调用中始终保持；协程在控制离开时暂停执行，当控制再次进入时只能从离开的位置继续执行

- 下面代码的函数 asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。
	协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

	```javascript
	function asnycJob() {
	  // ...其他代码
	  var f = yield readFile(fileA);
	  // ...其他代码
	}
	```

## Generator

- Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）

## 子例程

- 主程序的一部分代码；又称为函数、过程、方法、子程序等；调用栈来传递调用关系，启动位置是唯一入口

## 参考

- http://www.ruanyifeng.com/blog/2015/04/generator.html

