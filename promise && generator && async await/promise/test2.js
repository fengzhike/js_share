var promise = new Promise((resolve, reject) => resolve('success'))
/*
promise.then(value=> {
	console.log(value)
}).then(value=>{
	console.log(value)
})
*/
/*
return 一个同步的值 (或者 undefined)
*/

/*
promise.then(value=> {
	console.log(value)
	return new Promise((resolve, reject)=>resolve('success1'))
}).then(value=>{
	console.log(value)
})*/
/*
return 另一个 promise
*/


promise.then(value=> {
	console.log(value)
	throw new Error('aaa')
}).then(value=>{
	console.log(value)
}).catch(error=>{
	console.log(error)
})
/*
throw 一个同步异常
*/
