/*
基本的 api
Promise.resolve()
Promise.reject()
Promise.prototype.then()
Promise.prototype.catch()
Promise.all() // 所有的完成
Promise.race() // 竞速，完成一个即可
*/

// var p = Promise.resolve('success')

// p.then(value=>{
// 	console.log(value)
// })
/*
上方定义一个只有Resolved状态的promise对象
*/

// p = Promise.reject('error')
// p.catch(error=>{
// 	console.log(error)
// })
/*
上方定义一个只有Rejected状态的promise对象
*/


var p1 = Promise.resolve('success1')
var p2 = Promise.resolve('success2')
var p3 = Promise.reject('error')

Promise.all([p1,p2,p3]).then(value=>{
	console.log(value)
}).catch(error=>{
	console.log(error)
})
/*
上方多个promise一起调用
*/

// Promise.race([p1,p2]).then(value=>{
// 	console.log(value)
// })
/*
上方竞速，完成一个即可
*/