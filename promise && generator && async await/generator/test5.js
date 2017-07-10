var  [1, [[2, 3], 4], [5, 6]];
var gen = function* (a) {
    a.forEach(function (item) {
        if (typeof item !== 'number') {
            yield* gen(item);
        } else {
            yield item;
    	}
    })

    /*
    var length = a.length;
    for (var i = 0; i < length; i++) {
        var item = a[i];
        if (typeof item !== 'number') {
            yield* gen(item);
        } else {
            yield item;
        }
    }*/
};

for (var f of gen(arr)){
    console.log(f);
}

/*
也不能在非Generator函数中使用yield

yield*这种语句让我们可以在Generator函数里面再套一个Generator， 当然你要在一个Generator里面调用另外的Generator需要使用: yield* 函数() 这种语法， 都是套路啊
*/
