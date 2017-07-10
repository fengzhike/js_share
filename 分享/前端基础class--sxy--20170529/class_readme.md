#  ES6--Class
## 基本语法
ES5的写法:
```
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

ES6的语法:
```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

基本上，ES6的class可以看作只是一个语法糖，它的绝大部分功能，ES5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```
typeof Point // ?
Point === Point.prototype.constructor // ?
```
<!--
"function"
true
-->

```
let p = new Point();
p.constructor === Point.prototype.constructor // ?
```
<!--true-->

## ES6下的class与ES5下function的关联
ES5下的输出:
```
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype)        // ?
Object.getOwnPropertyNames(Point.prototype)     // ?
```
<!--
["toString"]
["constructor","toString"]
-->

相应的ES6的写法:
```
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)    // ?
Object.getOwnPropertyNames(Point.prototype)     //?
```
<!--
[]
["constructor","toString"]
 -->
 
 自定义设置方法:
```
Point.prototype.toAA = function() {}
Object.keys(Point.prototype)    // ?
Object.getOwnPropertyNames(Point.prototype)     //?

Object.assign(Point.prototype, {
    toString(){},
    toBB(){}
});
Object.keys(Point.prototype)    // ?
Object.getOwnPropertyNames(Point.prototype)     //?
```
<!--
 ["toAA"]
 ["constructor","toString","toAA"]
 ["toAA", "toBB"]
 ["constructor","toString","toAA", "toBB"]

 
类的内部所有定义的方法，都是不可枚举的（non-enumerable）。
toString方法是Point类内部定义的方法，它是不可枚举的。这一点与ES5的行为不一致。
构造函数的prototype属性，在ES6的“类”上面继续存在。
通过prototype和assign可以自己添加方法,自己定义的方法是可以枚举的
 -->

## 构造函数和声明
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。
如果忘记加上new，像函数那样调用Class，将会报错。
```
// 报错
var point = Point(2, 3);

// 正确
var point = new Point(2, 3);
```

```
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo // ?
```
<!-- 
false 

constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
-->

```
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
let inst = new MyClass();
inst.getClassName() // ?
Me.name     //?
```
<!--
"Me"
Uncaught ReferenceError: Me is not defined

这个类的名字是MyClass而不是Me，Me只在Class的内部代码可用，指代当前类。
Me只在Class内部有定义。如果类的内部没用到的话，可以省略Me
-->

```
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // 正常?
```
<!--
person是一个立即执行的类的实例。
-->

## 原型
```
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // ?

point.hasOwnProperty('x') // ?
point.hasOwnProperty('y') // ?
point.hasOwnProperty('toString') // ?
point.__proto__.hasOwnProperty('toString') // ?

var point2 = new Point(3, 4);
point.__proto__ == point2.__proto__  //?
```
<!--
 (2, 3)
 
 true
 true
 false
 true
 
 true
 
 x和y都是实例对象point自身的属性（因为定义在this变量上），所以hasOwnProperty方法返回true，而toString是原型对象的属性（因为定义在Point类上），所以hasOwnProperty方法返回false。这些都与ES5的行为保持一致。
 
 与ES5一样，类的所有实例共享一个原型对象。
-->


```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ?
    super(x, y);
    this.color = color; // ?
  }
}

var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // ? 
p2.__proto__.__proto__ === p1.__proto__ // ? 
```
<!--
false
true
子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型。
上面代码中，ColorPoint继承了Point，导致前者原型的原型是后者的原型。

因此，通过子类实例的__proto__.__proto__属性，可以修改父类实例的行为。
-->
```
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};

p1.printName() // "Ha"
```
上面代码在ColorPoint的实例p2上向Point类添加方法，结果影响到了Point的实例p1。



## 不存在变量提升
Class不存在变量提升（hoist），这一点与ES5完全不同。
```
new Foo(); // ReferenceError
class Foo {}
```

```
{
  let Foo = class {};
  class Bar extends Foo {   //不报错
  }
}
```

```
class Foo { 
    echo() {
        console.log("i'm outside")
    }
}
{
  let Foo = class {
    echo() {
        console.log("i'm inside")
    }
  };
  class Bar extends Foo {
  }
  
  new Bar().echo()  //?
} 
new Bar().echo()    //?
```
<!--
i'm inside
Uncaught ReferenceError: Bar is not defined

总之就是块级作用域
-->


## 严格模式
```
class Logger {
	 
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    a = text + text
    console.log(a);
  }
}
new Logger().print("ab") //?
```

<!--类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。

考虑到未来所有的代码，其实都是运行在模块之中，所以ES6实际上把整个语言升级到了严格模式。-->



## this的指向
```
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName();    //?
```
<!--
 TypeError: Cannot read property 'print' of undefined
 -->

```
class Logger {
  constructor() {
    this.printName = this.print.bind(this);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName("Hello there"); //?
```
<!--Hello there-->

```
class Logger {
  constructor() {
    this.printName = (name = 'there') => {
      this.print(`Hello ${name}`);
    };
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName();    //?
```
<!--Hello there-->

```
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
const { printName } = logger;
printName();    //?
```
<!--Hello there-->

# 面向对象三个特性: 封装\继承\多态

## 私有方法

1.一种做法是在命名上加以区别。

```
class Widget {

  // 公有方法
  foo (baz) {
    this._bar(baz);
  }

  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  }

  // ...
}
```

2.另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的。

```
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
```
上面代码中，foo是公有方法，内部调用了bar.call(this, baz)。这使得bar实际上成为了当前模块的私有方法。

3.还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值。

```
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```
上面代码中，bar和snaf都是Symbol值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果。


## 继承基本用法:
```
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```
子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。

```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ?
    super(x, y);
    this.color = color; // ?
  }
}
```

<!-- 
ReferenceError
 正常
 
 ES5的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。
 ES6的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。
 -->

```
let cp = new ColorPoint(25, 8, 'green');

cp instanceof ColorPoint // ? 
cp instanceof Point // ?
```
<!--
true
true
-->


## 类的prototype属性和__proto__属性    

```
class A {
}

class B extends A {
}

B.__proto__ === A // ?
B.prototype.__proto__ === A.prototype // ? 
```
<!--
true
true

大多数浏览器的ES5实现之中，每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。
Class作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。

（1）子类的__proto__属性，表示构造函数的继承，总是指向父类。

（2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。

上面代码中，子类B的__proto__属性指向父类A，子类B的prototype属性的__proto__属性指向父类A的prototype属性。
-->

这样的结果是因为，类的继承是按照下面的模式实现的。
ES5是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
ES6是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。
```
class A {
}

class B {
}

// B的实例继承A的实例
Object.setPrototypeOf(B.prototype, A.prototype);
const b = new B();

// B的实例继承A的静态属性
Object.setPrototypeOf(B, A);
const b = new B();
《对象的扩展》一章给出过Object.setPrototypeOf方法的实现。

Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
因此，就得到了上面的结果。

Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；作为一个构造函数，子类（B）的原型（prototype属性）是父类的实例。

Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
```


## 三种特殊情况的继承
第一种特殊情况，子类继承Object类。
```
class A extends Object {
}

A.__proto__ === Object // ?
A.prototype.__proto__ === Object.prototype // ?
```
<!--
true
true
这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。-->

第二种特殊情况，不存在任何继承。
```
class A {
}

A.__proto__ === Function.prototype // ?
A.prototype.__proto__ === Object.prototype // ?
```
<!--
true
true

这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。
但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。
-->

第三种特殊情况，子类继承null。
```
class A extends null {
}

A.__proto__ === Function.prototype // ?
A.prototype.__proto__ === undefined // ?
```
<!--
true
true

这种情况与第二种情况非常像。A也是一个普通函数，所以直接继承Function.prototype。
但是，A调用后返回的对象不继承任何方法，所以它的__proto__指向Function.prototype，即实质上执行了下面的代码。

class C extends null {
  constructor() { return Object.create(null); }
}
-->

## super 关键字
super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。
```
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
上面代码中，子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。


```
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // ?
new B() // ?
```
<!--
A
B
注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，因此super()在这里相当于A.prototype.constructor.call(this)。
上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。
也就是说，super()内部的this指向的是B。
-->

作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。

```
class A {}

class B extends A {
  m() {
    super(); // 报错
  }
}
```
上面代码中，super()用在B类的m方法之中，就会造成句法错误。

第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

```
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // ?
  }
}

let b = new B();
```

```
class A {}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x) // ?
  }
}

let b = new B();
```

```
class A {
  p() {
    return 2;
  }
}

class B extends A {
  get m() {
    return super.p(); // ?
  }
}
```

```
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // ?
```
<!--
2
2
2
undefined

上面代码中，子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。

这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
上面代码中，p是父类A实例的属性，super.p就引用不到它。

如果属性定义在父类的原型对象上，super就可以取到。


上面代码中，属性x是定义在A.prototype上面的，所以super.x可以取到它的值。-->

继承场景下this的指向:
```
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // ?
```
<!--
2
ES6 规定，通过super调用父类的方法时，super会绑定子类的this。

上面代码中，super.print()虽然调用的是A.prototype.print()，但是A.prototype.print()会绑定子类B的this，导致输出的是2，而不是1。也就是说，实际上执行的是super.print.call(this)。
-->

```
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // ?
    console.log(this.x); // ?
  }
}

let b = new B();
```
<!--
undefined
3

由于绑定子类的this，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
上面代码中，super.x赋值为3，这时等同于对this.x赋值为3。而当读取super.x的时候，读的是A.prototype.x，所以返回undefined。
-->

```
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // ?

var child = new Child();
child.myMethod(2); // ?
```
<!--
static 1
instance 2

如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。

上面代码中，super在静态方法之中指向父类，在普通方法之中指向父类的原型对象。-->


```
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // ?
  }
}
```
<!--
报错

注意，使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

上面代码中，console.log(super)当中的super，无法看出是作为函数使用，还是作为对象使用，所以 JavaScript 引擎解析代码的时候就会报错。
这时，如果能清晰地表明super的数据类型，就不会报错。-->

```
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super.valueOf() instanceof B); // ?
  }
}

let b = new B();
```
<!--
true
上面代码中，super.valueOf()表明super是一个对象，因此就不会报错。同时，由于super绑定B的this，所以super.valueOf()返回的是一个B的实例。
-->

最后，由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。

```
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```


## 原生构造函数的继承
原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript的原生构造函数大致有下面这些。

Boolean()
Number()
String()
Array()
Date()
Function()
RegExp()
Error()
Object()

ES5的继承:
```
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});

var colors = new MyArray();
colors[0] = "red";
colors.length  // ?

colors.length = 0;
colors[0]  // ?
```
<!--
0
"red"

上面代码定义了一个继承Array的MyArray类。但是，这个类的行为与Array完全不一致。
ES5是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
之所以会发生这种情况，是因为子类无法获得原生构造函数的内部属性，通过Array.apply()或者分配给原型对象都不行。
原生构造函数会忽略apply方法传入的this，也就是说，原生构造函数的this无法绑定，导致拿不到内部属性。-->


ES6的继承:
```
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // ?

arr.length = 0;
arr[0] // ?
```
<!--
1
undefined

ES6允许继承原生构造函数定义子类，因为ES6是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。
这意味着，ES6可以自定义原生数据结构（比如Array、String等）的子类，这是ES5无法做到的。-->

extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。因此可以在原生数据结构的基础上，定义自己的数据结构。

## Class的取值函数（getter）和存值函数（setter）
与ES5一样，在Class内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```
class MyClass {
 constructor() {
   // ...
 }
 get prop() {
   return 'getter';
 }
 set prop(value) {
   console.log('setter: '+value);
 }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```
上面代码中，prop属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。
   
## Class 的 Generator 方法
如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数。
```
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x); //?
}
```
<!--
// hello
// world
上面代码中，Foo类的Symbol.iterator方法前有一个星号，表示该方法是一个 Generator 函数。
Symbol.iterator方法返回一个Foo类的默认遍历器，for...of循环会自动调用这个遍历器。-->

## Class的静态属性和实例属性
```
// 老写法
class Foo {
}
Foo.prop = 1;

// 新写法
class Foo {
  static prop = 1;
}
```
我的chrome是报错的...

## new.target属性

ES6为new命令引入了一个new.target属性，（在构造函数中）返回new命令作用于的那个构造函数。如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。
```
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

var obj = new Square(3); // ?
```
<!--
输出 false

子类继承父类时，new.target会返回子类。
-->

```
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // ?
var y = new Rectangle(3, 4);  // ?
```

<!--
报错
正确

上面代码中，Shape类不能被实例化，只能用于继承。

利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。-->

注意，在函数外部，使用new.target会报错。

##  Mixin模式的实现
Mixin模式指的是，将多个类的接口“混入”（mix in）另一个类。它在ES6的实现如下。
```
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```
上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
```
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```