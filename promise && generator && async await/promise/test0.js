var promise = new Promise(function(resolve, reject) {
 if (1==1){
 	setTimeout(()=>resolve('success'),1);
 } else {
 	setTimeout(()=>reject('error'),1);
 }
});


promise.then(function(value) {
 	console.log(value)
}, function(value) {
 	console.log(value)
});

/*
Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 方法和 reject 方法
resolve:Resolved（已完成）状态调用resolve函数
reject:Rejected(已失败)状态调用reject函数
*/