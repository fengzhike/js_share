function co(generator) {
  return function(fn) {
	var gen = generator();
	function next(err, result) {
		if(err){
			return fn(err);
		}
  		var step = gen.next(result);
		if (!step.done) {
			step.value(next);
		} else {
			fn(null, step.value);
		}
	}
	next();
   }
}

function readFile(filename) {
    return function(callback) {
	    require('fs').readFile(filename, 'utf8', callback);
    };
}

co(function * () {
	console.log('start')	
    var file1 = yield readFile('./test7.txt');
    console.log(file1);
    var file2 = yield readFile('./test7.txt');
    console.log(file2);
    return 'done';
})(function(err, result) {
    console.log(result)
});

/*co 是用来自动执行generator函数的工具*/