function* calc(num){
    let count = yield 1 + num;
    return count + 1;
}

let p = calc(2);
console.info(p.next().value); 
console.info(p.next().value); 

/*
上面的代码第一个输出是yield 1 + num的结果，yield 1返回1，加上传进来的2，结果是3.
继续输出第二个，按正常想法，应该输出3，但是由于yield 1是上一轮计算的，这轮碰到上一轮的yield时返回的总是undefined。
这就导致yield 1返回undefined，undefined + num返回的是NaN，count + 1也还是NaN，所以输出是NaN。
*/

function* calc1(num){
    let count = yield 1 + num;
    return count + 1;
}

p = calc1(2);

console.info(p.next().value); 
console.info(p.next(3).value); 

/*
next可以带参数赋值上一次yield的值
*/