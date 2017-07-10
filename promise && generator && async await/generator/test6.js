function sleep (time) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve();
		}, time);
	})
};
function* start() {
	// 在这里使用起来就像同步代码那样直观
	console.log('start');
	yield sleep(3000);
	console.log('end');
};
let gen = start();

gen.next().value.then(()=>gen.next())

/*
先输出'start'
等待3秒
再输出'end'
*/