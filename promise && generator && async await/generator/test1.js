function* gen() {
    yield 0;
    yield 1;
    return 2;
    yield 3;
};
let g = gen();
console.log(g.next(),g.next(),g.next(),g.next());

/*
如果把yield和return一起使用的话， 那么return的值也会作为最后的返回值， 如果return语句后面还有yield， 那么这些yield不生效
*/