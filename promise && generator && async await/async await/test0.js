const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = async () => {
  const t = await f();
  console.log(t);
};

testAsync();

/*
首先定义了一个函数 f ，这个函数返回一个 Promise，并且会延时 2 秒， resolve 并且传入值 123。
 testAsync 函数在定义时使用了关键字 async ，然后函数体中配合使用了 await ，最后执行 testAsync 。
 整个程序会在 2 秒后输出 123，也就是说 testAsync 中常量 t 取得了 f 中 resolve 的值，
 并且通过 await 阻塞了后面代码的执行，直到 f 这个异步函数执行完
*/

/*
const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = () => {
  f().then((t) => {
    console.log(t);
  });
};

testAsync();
*/
/*
对比 Promise

仅仅是一个简单的调用，就已经能够看出来 async/await 的强大，写码时可以非常优雅地处理异步函数，
彻底告别回调恶梦和无数的 then 方法。我们再来看下与 Promise 的对比，同样的代码，如果完全使用 Promise 会有什么问题呢？

从代码片段中不难看出 Promise 没有解决好的事情，比如要有很多的 then 方法，整块代码会充满 Promise 的方法，而不是业务逻辑本身，
而且每一个 then 方法内部是一个独立的作用域，要是想共享数据，就要将部分数据暴露在最外层，在 then 内部赋值一次。
虽然如此，Promise 对于异步操作的封装还是非常不错的，所以 async/await 是基于 Promise 的， await 后面是要接收一个 Promise 实例。
*/

/*RSJS 另外一种方式可以去看看*/