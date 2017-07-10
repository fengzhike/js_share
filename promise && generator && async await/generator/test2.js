function* gen(id){
    yield 'id';
    yield id;
    return 'finish';
}

let p = gen('123');
for(let id of p){
    console.info(id);
}

/*
当函数符合Generator语法时，直接执行时返回的不是一个确切的结果，而是一个函数迭代器，因此也可以用for...of来遍历，遍历时碰到结果done为true则停止
因为最后一个finish的done是true，所以for...of停止遍历，最后一个就不会打印出来
*/