const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(234);
    }, 2000);
  });
};

const testAsync = async () => {
  try {
    const t = await f();
    console.log(t);
  } catch (err) {
    console.log(err);
  }
};

testAsync();

/*
异常处理

通过使用 async/await，我们就可以配合 try/catch 来捕获异步操作过程中的问题，包括 Promise 中 reject 的数据。

代码片段中将 f 方法中的 resolve 改为 reject ，在 testAsync 中，通过 catch 可以捕获到 reject 的数据，输出 err 的值为 234。 
try/catch 使用时也要注意范围和层级。如果 try 范围内包含多个 await ，那么 catch 会返回第一个 reject 的值或错误。
*/



