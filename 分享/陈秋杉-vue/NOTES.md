# vue.JS
    轻量高效的前端组件化方案(不支持 IE8 及其以下版本)

- Vue.js是用于构建交互式的 Web 界面的库，它提供了 MVVM 数据绑定和一个可组合的组件系统，具有简单、灵活的 API。从技术上讲， Vue.js 集中在 MVVM 模式上的视图模型层，并通过双向数据绑定连接视图和模型。实际的 DOM 操作和输出格式被抽象出来成指令和过滤器。相比其它的 MVVM 框架，Vue.js更容易上手。特点：

    1. 响应的数据绑定 每当修改了数据，DOM 便相应地更新。这样我们应用中的逻辑就 几乎都是直接修改数据了，不必与 DOM 更新搅在一起。这让我 们的代码更容易 撰写、理解与维护。
    2. 组件系统 让我们可以用独立可复用的小组件来构建大型应用。
    3. 特性 简洁 数据驱动 组件化 轻量快速 模块友好。

## vue的安装

- `npm install vue`

- `npm install -g vue-cli`
安装vue-cli脚手架构建工具,帮助你快速的构建一个拥有强大构建能力的Vue.js项目

-  `vue init webpack my-project`
创建一个基于 webpack 模板的新项目

- 进入项目目录（cd my-Project），使用 npm 安装依赖
- `npm run dev` 启动项目
- `npm run build` 打包上线
- 自己的项目文件都需要放到 src 文件夹下，打包完成后，会生成 dist 文件夹，如果已经修改了文件路径，可以直接打开本地文件查看，项目上线时，只需要将 dist 文件夹放到服务器就行了。

## vue 的使用
1. 实例 每个vueJS应用都是通过构造函数 vue 创建一个vue 的根实例启动的：

- el data 代理属性 每个 Vue 实例都会代理其 data 对象里所有的属性：
```
var vm = new Vue({
        // 选择目标元素
        el:'#app',
        // 提供初始数据
        data:{
            name:'陈秋杉',
            age:18
        })
```

- 设置属性也会影响到原始数据，刷新视图

```
var data = {name:'cqs',age:18}
var vm = new Vue({
    // 选择目标元素
    el:'#app',
    // 提供初始数据
    data:data
})

vm.name = 'LLL'
data.age = 20
```
- 注意：
    - 不能将原数据指向新的数据，否则不能刷新视图
    - 实例创建后不能设置以前没有的属性，无法映射到视图


- Vue 实例暴露了一些有用的实例属性与方法，这些属性与方法都有前缀 $，以便与代理的 data 属性区分

- 在使用Vue写应用时发现一个问题，每当进入一些有延时的（如网络API请求）操作时，会先闪一下未编译的{{ message}}，官网给的解决方案是定义[v-cloak]的style，在使用了{{message}}的地方加上 v-cloak
```
<style>
    [v-cloak] {
        display: none;
    }
</style>

<div v-cloak>{{ message}}</div>
```

- 注意，不要在实例属性或者回调函数中使用箭头函数。因为箭头函数绑定父上下文，所以 this 不会像预想的一样是 Vue 实例，而是 this.myMethod 未被定义。

2. 双向数据绑定 v-model
- {{}}将模型的数据取出显示到页面上,支持三元运算等一些简单的表达式
```
{{msg?msg:'没有数据'}}
{{msg + 'vue is good'}}
{{ msg.split('').reverse().join('') }}
```

- v-model 可以添加修饰符 .lazy .number .trim
    - .lazy 表示在 "change" 而不是 "input" 事件中更新
    ```
    <input type="text" v-model.lazy="msg"/>
    ```

    - .number 可以将用户的输入值转为 Number 类型（如果原值的转换结果为 NaN 则返回原值）
        ```
        <input v-model.number="msg" type="number"/>
        ```

    - .trim 自动过滤用户输入的首尾空格
        ```
        <input v-model.trim="msg"/>
        ```

- 双大括号会将数据解释为纯文本，而非 HTML。为了输出真正的 HTML ，你需要使用 v-html 指令：
```
<div v-html="message"></div>
<script>
    var vm = new Vue({
            el:'.helloVue',
            data:{
                message:'<h1>hello Vue！</h1>'
            }
        });
</script>
```

3. v-for 列表渲染指令
- 根据一组数组的选项列表进行渲染，需要以 item in items 形式的特殊语法， items 是源数据数组， item 是数组元素。

4. v-on vue.js通过v-on完成事件处理与绑定
- 也可添加修饰符
    - .stop 阻止冒泡
    - .preven 阻止默认行为
    - @keyup.enter 键修饰符

5. v-if/v-else-if/v-else/v-show

- v-if用于条件判断，和v-else是一对

```
<div v-if="false">hello</div>
<div v-else-if="false">vue</div>
<div v-else>world</div>

```
> v-else 元素必须紧跟在 v-if 元素或者 v-else-if的后面——否则它不能被识别。

- 如果我们想切换多个元素呢？此时我们可以把一个 <template> 元素当做包装元素，并在上面使用 v-if，最终的渲染结果不会包含它。

> v-show作用与v-if类似，不同的是v-show的元素会始终渲染并保持在 DOM 中,且v-show不支持<template>标签。

6. v-bind 主要用于属性绑定
```
<!-- 完整语法 -->
<a v-bind:href="url"></a>
```
- Vue官方提供了一个简写方式 :bind 例如：
```
<!-- 缩写 -->
<a :href="url"></a>
```





