function* calc(num){
    let count = yield 1 + num;
    return count + 1;
}

let p = calc(2);
let curr = p.next();
while(!curr.done){
    console.info(curr.value);
    curr = p.next(curr.value);
}
console.info(curr.value); // 最终结果，最后一次done==true

/*
遍历所有值
*/