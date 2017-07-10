# 浏览器怎么工作的

## 一、引用

http://taligarsiel.com/Projects/howbrowserswork1.htm

## 二、干嘛用的？

爱干嘛用干嘛用，你们懂得

## 三、主要构成（High Level Structure）

### 浏览器主要组件

![](./images/01.png)

- 用户界面:包括地址栏、后退/前进按钮、书签目录等，除了用来显示你所请求页面的主窗口之外的其他部分
- 浏览器引擎:用来查询及操作渲染引擎的接口
- 渲染引擎:用来显示请求的内容，例如，如果请求内容为html，它负责解析html及css，并将解析后的结果显示出来
- 网络:用来完成网络调用，例如http请求，它具有平台无关的接口，可以在不同平台上工作
- UI后端:用来绘制类似组合选择框及对话框等基本组件，具有不特定于某个平台的通用接口，底层使用操作系统的用户接口
- JS解释器:用来解释执行JS代码
- 数据存储:属于持久层，浏览器需要在硬盘中保存类似cookie的各种数据，HTML5定义了web database技术，这是一种轻量级完整的客户端存储技术

### 注意

不同于大部分浏览器，Chrome为每个Tab分配了各自的渲染引擎实例，每个Tab就是一个独立的进程。

## 四、渲染引擎(The rendering engine)

渲染引擎的职责就是渲染，即在浏览器窗口中显示所请求的内容。

默认情况下，渲染引擎可以显示html、xml文档及图片，它也可以借助插件（一种浏览器扩展）显示其他类型数据，例如使用PDF阅读器插件，可以显示PDF格式，将由专门一章讲解插件及扩展。

这里只讨论渲染引擎最主要的用途——显示应用了CSS之后的html及图片。

### 有哪些渲染引擎

- Firefox:Geoko
- Safari:webkit
- Chrome:webkit
- Edge:Edge

### 主流程(The main flow)

1. 通过网络获得所请求文档的内容，通常以8K分块的方式完成。

2. 接下去的基本流程

![](./images/02.png)

* 解析html以构建dom树

渲染引擎开始解析html，并将标签转化为内容树中的dom节点

* 构建render树

解析外部CSS文件及style标签中的样式信息。这些样式信息以及html中的可见性指令将被用来构建render树
Render树由一些包含有颜色和大小等属性的矩形组成，它们将被按照正确的顺序显示到屏幕上。
display:none的节点不会出现在render树，visibility:hidden会因为要占位

* 布局render树

执行布局过程，确定每个节点在屏幕上的确切坐标

* 绘制render树

遍历render树，并使用UI后端层绘制每个节点。

### Webkit,Geoko主流程

![](./images/03.png)

Webkit主流程

![](./images/04.jpg)

Geoko主流程

### 注意

这个过程是逐步完成的，为了更好的用户体验，渲染引擎将会尽可能早的将内容呈现到屏幕上，并不会等到所有的html都解析完成之后再去构建和布局render树。它是解析完一部分内容就显示一部分内容，同时，可能还在通过网络下载其余内容。


### 回流(Reflow)、重绘(Repaint)

- 回流(Reflow)

对于DOM结构中的各个元素都有自己的盒子（模型），这些都需要浏览器根据各种样式（浏览器的、开发人员定义的等）来计算并根据计算结果将元素放到它该出现的位置

- 重绘(Repaint)

当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color

- 注意

回流必将引起重绘，而重绘不一定会引起回流。

- 引起Repain和Reflow的一些操作

Reflow 的成本比 Repaint 的成本高得多的多。DOM Tree 里的每个结点都会有 reflow 方法，一个结点的 reflow 很有可能导致子结点，甚至父点以及同级结点的 reflow。 

	- 当你增加、删除、修改 DOM 结点时，会导致 Reflow 或 Repaint。 
	- 当你移动 DOM 的位置，或是搞个动画的时候。 
	- 当你修改 /删除CSS 样式的时候。 
	- 当你 Resize 窗口的时候（移动端没有这个问题），或是滚动的时候。 
	- 当你修改网页的默认字体时。 
	- 当你设置 style 属性的值 

- 如何减少Repain和Reflow?

Reflow是不可避免的，只能将Reflow对性能的影响减到最小,给出下面几条建议

> 1.不要一条一条地修改 DOM 的样式

```javascript
// 不好的写法
var left = 10,
top = 10;
el.style.left = left + "px";
el.style.top  = top  + "px";
el.style.background = '#eee'; 

// 比较好的写法
el.className += " theclassname";    
```
> 2.让要操作的元素进行”离线处理”，处理完后一起更新 

* 使用DocumentFragment进行缓存操作,引发一次回流和重绘；
* 使用display:none技术，只引发两次回流和重绘;
* 使用cloneNode(true or false) 和 replaceChild 技术，引发一次回流和重绘； 

> 3.不要把 DOM 节点的属性值放在一个循环里当成循环里的变量。不然这会导致大量地读写这个结点的属性。 

> 4.尽可能的修改层级比较低的 DOM节点。当然，改变层级比较底的 DOM节点有可能会造成大面积的 reflow，但是也可能影响范围很小。 

> 5.将需要多次重排的元素，position属性设为absolute或fixed，这样此元素就脱离了文档流，它的变化不会影响到其他元素为动画的 HTML 元素

> 6.不要用tables布局的一个原因就是tables中某个元素一旦触发reflow就会导致table里所有的其它元素reflow

> 7.避免使用CSS的JavaScript表达式，如果css里有expression，每次都会重新计算一遍

