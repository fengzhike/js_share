# Proxy
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

## 基本用法
```
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1
++obj.count
// ?
```
<!--
//  setting count!
//  getting count!
//  setting count!
//  2
上面代码对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为。这里暂时先不解释具体的语法，只看运行结果。对设置了拦截行为的对象obj，去读写它的属性，就会得到下面的结果。
Proxy 实际上重载（overload）了点运算符，即用自己的定义覆盖了语言的原始定义。

-->

语法:
```
var proxy = new Proxy(target, handler);
```
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。
其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。


```
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // ?
```
<!--
"b"
如果handler没有设置任何拦截，那就等同于直接通向原对象。
上面代码中，handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target。-->


## 技巧
一个技巧是将 Proxy 对象，设置到object.proxy属性，从而可以在object对象上调用。
```
var object = { proxy: new Proxy(target, handler) };
```
Proxy 实例也可以作为其他对象的原型对象。
```
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```
上面代码中，proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截。


## 拦截多个操作(apply\construct等)
```
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // ?
new fproxy(1,2) // ?
fproxy.prototype === Object.prototype // ?
fproxy.foo // ?
```
<!--
1
{value: 2}
true
"Hello, foo"-->

## Proxy 支持的拦截操作一览
### 关于isExtensible/preventExtensions有一系列限制规则：

只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true

拦截后的返回值不能对象属性冲突或类型不对
如果preventExtensions，ownKeys不能返回超出原有的值

configurable: false  不能被代理 getOwnProperties，deleteProperty
writable: false, 不能被代理 get、set

目标对象不可扩展（extensible），则defineProperty不能增加目标对象上不存在的属性

如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置

如果目标对象不可扩展（extensible）， getPrototypeOf方法必须返回目标对象的原型对象。

isExtensible这个方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误。

如果目标对象不可扩展（extensible），setPrototypeOf方法不得改变目标对象的原型

ownKeys方法之中，显式返回不存在的属性（d）、Symbol 值（Symbol.for('secret')）、不可遍历的属性（key），结果都被自动过滤掉。
如果有其他类型的值，或者返回的根本不是数组，就会报错。
obj对象的a属性是不可配置的，这时ownKeys方法返回的数组之中，必须包含a

### （1）get(target, propKey, receiver)
拦截对象属性的读取，比如proxy.foo和proxy['foo']。
最后一个参数receiver是一个对象，可选，参见下面Reflect.get的部分。

栗子:
```
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // ?
```
<!--
c

例子使用get拦截，实现数组读取负数的索引。
-->

```
var pipe = (function () {
  return function (value) {
    var funcStack = [];
    var oproxy = new Proxy({} , {
      get : function (pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function (val, fn) {
            return fn(val);
          },value);
        }
        funcStack.push(window[fnName]);
        return oproxy;
      }
    });

    return oproxy;
  }
}());

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // ?
```
<!--
63

利用 Proxy，可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作
-->


```
const dom = new Proxy({}, {
  get(target, property) {
    return function(attrs = {}, ...children) {
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);
```
例子则是利用get拦截，实现一个生成各种DOM节点的通用函数dom。

```
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo   //能否拦截?
```
<!--
// TypeError: Invariant check failed

如果一个属性不可配置（configurable）和不可写（writable），则该属性不能被代理，通过 Proxy 对象访问该属性会报错。
-->


（2）set(target, propKey, value, receiver)
拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。

栗子:
```
var handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
var target = {};
var proxy = new Proxy(target, handler);
proxy._prop     //?
proxy._prop = 'c'       //?
```
<!--
// Error: Invalid attempt to get private "_prop" property
// Error: Invalid attempt to set private "_prop" property
-->


（3）apply(target, object, args)
拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。

栗子:
```
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // ?
proxy.call(null, 5, 6) // ?
proxy.apply(null, [7, 8]) //?
Reflect.apply(proxy, null, [9, 10]) //?
```
<!--
6
22
30
38
-->

（4）has(target, propKey)
拦截propKey in proxy的操作，返回一个布尔值。

栗子:
```
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // ?
```
<!--
false

如果原对象的属性名的第一个字符是下划线，proxy.has就会返回false，从而不会被in运算符发现。
-->

```
var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

'a' in p // ?
```
<!--
TypeError is thrown

如果原对象不可配置或者禁止扩展，这时has拦截会报错。
上面代码中，obj对象禁止扩展，结果使用has拦截就会报错。也就是说，如果某个属性不可配置（或者目标对象不可扩展），则has方法就不得“隐藏”（即返回false）目标对象的该属性。

值得注意的是，has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。
-->

```
let stu1 = {name: '张三', score: 59};
let stu2 = {name: '李四', score: 99};

let handler = {
  has(target, prop) {
    if (prop === 'score' && target[prop] < 60) {
      console.log(`${target.name} 不及格`);
      return false;
    }
    return prop in target;
  }
}

let oproxy1 = new Proxy(stu1, handler);
let oproxy2 = new Proxy(stu2, handler);

'score' in oproxy1 //?

'score' in oproxy2  //?

for (let a in oproxy1) {
  console.log(oproxy1[a]);
}
//?

for (let b in oproxy2) {
  console.log(oproxy2[b]);
}
//?
```
<!--
// 张三 不及格
// false
// true
// 张三
// 59
// 李四
// 99

另外，虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效。
-->


（5）construct(target, args)
拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
construct方法可以接受两个参数:
target: 目标对象
args：构建函数的参数对象

例子:
```
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value //?
```
<!--
// "called: 1"
// 10
-->

```
var p = new Proxy(function() {}, {
  construct: function(target, argumentsList) {
    return 1;
  }
});

new p() // ?
```
<!--
报错


construct方法返回的必须是一个对象，否则会报错。
-->

（6）deleteProperty(target, propKey)
拦截delete proxy[propKey]的操作，返回一个布尔值。
如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。

注意，目标对象自身的不可配置（configurable）的属性，不能被deleteProperty方法删除，否则报错。

```
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop  //?
```
<!--// Error: Invalid attempt to delete private "_prop" property-->

（7）defineProperty(target, propKey, propDesc)
拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。

栗子:
```
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' //?
```
<!--
TypeError: proxy defineProperty handler returned false for property '"foo"'

上面代码中，defineProperty方法返回false，导致添加新属性会抛出错误。

注意，如果目标对象不可扩展（extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。
-->

（8）getOwnPropertyDescriptor(target, propKey)
方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。
```
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
};
var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat') // ?
Object.getOwnPropertyDescriptor(proxy, '_foo')  // ?
Object.getOwnPropertyDescriptor(proxy, 'baz')  // ? 
```
<!--
undefined
undefined
{ value: 'tar', writable: true, enumerable: true, configurable: true }
-->

（9）getPrototypeOf(target)
拦截Object.getPrototypeOf(proxy)，返回一个对象。
getPrototypeOf方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。

Object.prototype.__proto__
Object.prototype.isPrototypeOf()
Object.getPrototypeOf()
Reflect.getPrototypeOf()
instanceof
下面是一个例子。
```
var proto = {};
var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
});
Object.getPrototypeOf(p) === proto // ?
```
<!--
true
上面代码中，getPrototypeOf方法拦截Object.getPrototypeOf()，返回proto对象。

注意，getPrototypeOf方法的返回值必须是对象或者null，否则报错。另外，如果目标对象不可扩展（extensible）， getPrototypeOf方法必须返回目标对象的原型对象。
-->

（10）isExtensible(target)
拦截Object.isExtensible(proxy)，返回一个布尔值。
该方法只能返回布尔值，否则返回值会被自动转为布尔值。

```
var p = new Proxy({}, {
  isExtensible: function(target) {
    return false;
  }
});

Object.isExtensible(p) // ?
```
<!--
报错

这个方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误。

Object.isExtensible(proxy) === Object.isExtensible(target)
-->


（11）ownKeys(target)
拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，返回一个数组。
该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
栗子:
```
let target = {
  _bar: 'foo',
  _prop: 'bar',
  prop: 'baz'
};

let handler = {
  ownKeys (target) {
    return Reflect.ownKeys(target).filter(key => key[0] !== '_');
  }
};

let proxy = new Proxy(target, handler);
for (let key of Object.keys(proxy)) {
  console.log(target[key]);
}
// ?
```
<!--
"baz"

例子是拦截第一个字符为下划线的属性名。
-->

```
let target = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.for('secret')]: '4',
};

Object.defineProperty(target, 'key', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: 'static'
});

let handler = {
  ownKeys(target) {
    return ['a', 'd', Symbol.for('secret'), 'key'];
  }
};

let proxy = new Proxy(target, handler);

Object.keys(proxy) //?
```
<!--
// ['a']

使用Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回:
1)目标对象上不存在的属性
2)属性名为 Symbol 值
3)不可遍历（enumerable）的属性

上面代码中，ownKeys方法之中，显式返回不存在的属性（d）、Symbol 值（Symbol.for('secret')）、不可遍历的属性（key），结果都被自动过滤掉。
-->

```
var obj = {};

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return [123, true, undefined, null, {}, []];
  }
});

Object.getOwnPropertyNames(p)  //?
```
<!--
// Uncaught TypeError: 123 is not a valid property name

ownKeys方法返回的数组成员，只能是字符串或 Symbol 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。
上面代码中，ownKeys方法虽然返回一个数组，但是每一个数组成员都不是字符串或 Symbol 值，因此就报错了。
-->

```
var obj = {};
Object.defineProperty(obj, 'a', {
  configurable: false,
  enumerable: true,
  value: 10 }
);

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return ['b'];
  }
});

Object.getOwnPropertyNames(p) //?
```
<!--
// Uncaught TypeError: 'ownKeys' on proxy: trap result did not include 'a'

如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys方法返回，否则报错。

上面代码中，obj对象的a属性是不可配置的，这时ownKeys方法返回的数组之中，必须包含a，否则会报错。
-->

```
var obj = {
  a: 1
};

Object.preventExtensions(obj);

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return ['a', 'b'];
  }
});

Object.getOwnPropertyNames(p)
```
<!--
// Uncaught TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible

另外，如果目标对象是不可扩展的（non-extensition），这时ownKeys方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。

上面代码中，Obj对象是不可扩展的，这时ownKeys方法返回的数组之中，包含了obj对象的多余属性b，所以导致了报错。
-->

（12）preventExtensions(target)
拦截Object.preventExtensions(proxy)，返回一个布尔值。
该方法必须返回一个布尔值，否则会被自动转为布尔值。
```
var p = new Proxy({}, {
  preventExtensions: function(target) {
    return true;
  }
});

Object.preventExtensions(p) // ?
```
```
var p = new Proxy({}, {
  preventExtensions: function(target) {
    console.log('called');
    Object.preventExtensions(target);
    return true;
  }
});

Object.preventExtensions(p) //?
```
<!--
报错
"called"
true

这个方法有一个限制，只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错。

上面代码中，proxy.preventExtensions方法返回true，但这时Object.isExtensible(proxy)会返回true，因此报错。

为了防止出现这个问题，通常要在proxy.preventExtensions方法里面，调用一次Object.preventExtensions。

-->


（13）setPrototypeOf(target, proto)
拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。
```
var handler = {
  setPrototypeOf (target, proto) {
    throw new Error('Changing the prototype is forbidden');
  }
};
var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto); //?
```
<!--
// Error: Changing the prototype is forbidden
上面代码中，只要修改target的原型对象，就会报错。\

注意，该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展（extensible），setPrototypeOf方法不得改变目标对象的原型-->


## Proxy.revocable()
Proxy.revocable方法返回一个可取消的 Proxy 实例。
```
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // ?

revoke();
proxy.foo // ?
```
<!--
123
TypeError: Revoked

Proxy.revocable方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。上面代码中，当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。

Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。
-->


## this 问题 
虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。
主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
```
const _name = new WeakMap();

class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}

const jane = new Person('Jane');
jane.name // ?

const proxy = new Proxy(jane, {});
proxy.name // ?
```
<!--
'Jane'
undefined

目标对象jane的name属性，实际保存在外部WeakMap对象_name上面，通过this键区分。
由于通过proxy.name访问时，this指向proxy，导致无法取到值，所以返回undefined。
-->

```
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);

proxy.getDate(); //?
```
<!--
// TypeError: this is not a Date object.

有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性。
-->

```
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // ?
```
<!--
1

上面代码中，getDate方法只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错。这时，this绑定原始对象，就可以解决这个问题。
-->