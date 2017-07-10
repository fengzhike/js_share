const f1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(111);
    }, 2000);
  });
};

const f2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(222);
    }, 2000);
  });
};

const f3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(333);
    }, 2000);
  });
};


async function testAsync()  {
  try {
    const t1 = await f1();
    console.log(t1);
    const t2 = await f2();
    console.log(t2);
    const t3 = await f3();
    console.log(t3);
    return '444'
  } catch (err) {
    console.log(err);
  }
};

testAsync();

/*进阶,多次resolve*/