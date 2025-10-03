---
title: Node.JS 作者 Ryan Dahl 的故事
date: 2025-10-02T00:30:00.000Z
categories:
  - fe 
  - nodejs
---

今天我想来聊聊 Node.js 的作者 [Ryan Dahl(ry)](https://tinyclouds.org/)，前不久在它的一个演讲主题上了解到了一些关于他的故事，结合我自己的一些认知，我想 ry 的故事对于我们是有所启发的，无论是编程、工作还是生活方式。

像 ry 这样的程序员，我觉得工程师更符合他的 title，Node.js 是在[2009年5月28日](https://github.com/Node.js/node/releases/tag/v0.0.1) 发布 0.0.1 版本的，已经有 16 年的历史了。在这期间除了一些对外的技术类型的分享和演讲之外，很难找到和他相关的资料。但是这并不妨碍我们从他的作品和这 16 年间做的事情去了解他。

这篇文章会顺着 [Node.js: The Documentary | An origin story](https://www.youtube.com/watch?v=LB8KwiiUGy0) 的时间线总结和归纳下 ry 的经历。

早些年 ry 是纽约北部的一名数学研究生，并且准备攻读博士学。它在视频中讲到，他虽然喜欢数学这个领域，但是实际上他并没有做更多看得见的、能实践的事情。这和我们认知的数学这门学科是一致的。他说他想做一些事情是与人类正在发生的东西相关，然后他就退学了。

退学后他在 Craigslist（类似当年中国的黄页网站，百姓网之类的） 上找到了他的编程之路，当时他应聘了一家滑雪板公司，做一些营销网站，当然这并不是一些看起来很有意思的事情。他把注意力转向了更抽象的事情上，他使用 Ruby on Rails 实现了整个网站，发现它很慢，然后他就研究 nginx 模块，比较底层的 web 技术栈。

接着他遇到了自己自己的女朋友，并随她女朋友一起去了德国，在科隆生活了大约两年，因为科隆消费比较低，租房每月只要 400 刀，这让他有足够的空间和时间去思考一些事情，去做一些自己想做的项目。并且他认为这是一段20多岁时的愉快的时光。

从 [V8](https://v8.dev/) 发布的时候他就在考虑一个问题：**JavaScript 与非阻塞**。他在视频中也说到：这是一个在正确的时间思考正确的事情。

ry 呆在科隆的那段时间大概从 2月～10月的时候全职开发构建了第一个版本的 Node.js

[Isaac Schlueter(izs)](https://izs.me/) 在 Node.js 首次发布的时候是 yahoo 的工程师，还因为当时的工作总是要在 PHP 和 JavaScript 之间切换而感到沮丧，所以他会考虑为什么不使用 JavaScript 来做服务端的编程语言。当时也有一小部分人在试图将 JavaScript 实现成服务端编程语言，比如：Server.js,Jaxer,RingoJS。在当时 JavaScript 服务端能力已经有一些端倪了。Node.js 的出现有点出乎意料。Isaac Schlueter 说他认为 **ry 选择 JavaScript 并不是因为他喜欢 JavaScript，而是因为 JavaScript 很合适**。

ry 说在选择 JavaScript 之前也研究了像 Python,Lua, Haskell 这样的编程语言。但是有一天和朋友坐在一起，突然之间就有了一个想法：“我靠 JavaScript，就应该是 JavaScript”。就在那一刻他非常清楚的确定了是 JavaScript。

当时在其它编辑语言中基本上都有了一定的范式。但 JavaScript 还是空白。

非阻塞IO的实现在其它的编程语言实现都会有很大的阻力，比如在 Python 中打开一个文件，大家已经习惯了使用下面的同步IO范式来实现：

```python
with open("filename.txt", "r) as file:
	content = file.read()
```

所以使用 Python 来实现显然不是一个好的选择，因为这意味着 Python 开发者需要转换编程习惯。

后来越来越多的人知道了 Node.js，但是当时还没有包管理系统，**izs 就创建了 [NPM]([NPM](https://npmjs.org))**，最开始 NPM 的源代码是一些 shell 脚本，很多代码来自于 Yinst - yahoo 内部用的的包管理器。

ry 在 JSConf EU 上的主题演 [Ryan Dahl: Original Node.js presentation](https://www.youtube.com/watch?v=ztspvPYybIY) 首次对外公开 Node.js，可以看出来当时的他还是很青涩、很紧张的。

![ry.png](https://cdn.sa.net/2025/10/02/Txlamfcv37BWpRy.png)

ry 说他只是 JSConf 上的一个普通演讲者，但是他已经为了这个演讲提前几周做了充分的准备。每个人都在演示自己的 **玩具** 项目，而只有他写的 Node.js 是真正严肃的项目。它在现场展示了一个使用 Node.js 构建的 IRC 频道服务器，当场在同一个网络的观众也可以链接进去发消息。

在 Node.js 创建的初期，程序员还没有一些很好的沟通工具，没有 slack, discord, github 的功能还非常的原始，也没有任何持续集成的工具。大家都通过电子邮件将补丁发给 ry，然后手动合并到代码仓库中，ry 就像是个人工的 CI 工具一样，手动打补丁，手动测试。

JSConf 演讲之后 ry 还在科隆，当时已经有很多公司联系他说对他的项目感兴趣。他就飞到旧金山去和对方聊，也是为了这个项目能继续下去找一些资金支持。最后 joyent 提出了好的方案。joyent 是一个云服务提供商，他们想在自己的服务上运行 node 应用程序。

然后 ry 就搬到了旧金山，全职从事 Node 工作。他在 joyent 时除了 Node 没有任何其它工作。

[Bert Belder](https://github.com/piscisaureus) 在一家初创公司，为建筑公司做自动化，他们必须进行一些复杂的计算，他们为前端实现这些计算功能。使用 Node.js 在一夜之间完成了他们的数据迁移工作。他为解决了 node 在 window 平台上运行的问题。**Bert Belder 是 [libuv](https://github.com/libuv/libuv) 的作者**，libuv 是 libev 的集成者，它解决了不同平台异步 IO 模型的封装和实现。node 0.4 之前 libev，一个 select 的包装，很老而且速度一般，只支持 macOS 和 Linux，还不支持 window。

在早期的开发过程中 ry 通常会引入了破坏性变更，比如：v0.0.3中把 sys 模块更名为 util。然后大家都惊慌失措了。

npm 是随着 node 0.0.8 版本同时发布的，但是下一个 node 版本上就没法用了。所以社区都想要知道 node 第一个稳定版本什么时候发布的时候。ry 说 1.0 版本还没有完整的路线图，因为这是一个很遥远的版本，目前还是专注于 0.0.6 版本，需要重新设计管道，然后再重新审视这个问题。

工作了 1 年后，joyent 想从 ry 手里买下 Node.js 这个项目。ry 说他还不确定 joyent 从他手中买下一个开源项目是好事还是坏事。当然 ry 知道 joyent 的目的的：joyent 是想管理这个项目，拥有商标、网站并且利用这个来推广他们的公司。ry 同意了这笔交易，因为他当时并没有因此失去些什么，所以他感觉很好。社区当然会有很多质疑，大家会觉得这对 Node 意味着，如果 joyent 变坏会怎么样？但是因为 ry 和 joyent 达成的协议是 node.js 还是会以 MIT 许可来发布源代码，实际上 joyent 买的只是一个名字。

后来 Node.js 的运营和一些管理上的工作 joyent 会决定，ry 把管理上的一些事务交给了 Isaac 并逐渐退出了 Node.js，后来 Isaac 对于运营 Node.js 的工作感觉到无聊和厌倦，工作交给 TJ 后退出。

最后 joyent 也不怎么把精力投入到 node.js 中，node 代码仓库的迭代明显减少。更新明显放缓，社区觉得 Joyent 对新功能（比如 ES6 特性、模块系统、协程方案）的推进过于保守，维护效率不高。

Node Forward, 讨论 node 未来的发展，核心维护者向 joyent 提出开放式的管理。

mikreal 分叉 node.js 起名 iojs。

joyent 换 CEO Scott Hammond 与核心开发者沟通。

三个月后

双方就 Node.js 项目治理模式达成一致：技术方向和技术决策真正由社区驱动的，从而确保项目在真正的共识模式下运行，而不代表任何组织特殊利益的模式。io.js 成了一个重大的警告，让 joyent 意识到他们在node 中拥有的东西实际上危险之中。

同时建立 Node.js Foundion。joyent 说为了我们的利益，我们不需要成为 Node 的管理者，但是我们需要 Node 作为一个统一的项目

node 4.0 发布合并了 io.js

2019 年 Node.js Foundation 和 JS Foundation 合并成 OpenJS Foundation。

在这之后 ry 淡出 Node.js，他花了几年时间在其它兴趣上：机器学习，分布式系统，几何，摄影等。

2018 年 JSConf EU 回归，发表演讲 [10 Things I Regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA)，此时的 ry 看起来更潇洒、时尚。甚至不像是一个上技术分享会的程序员的形象，虽然还是很紧张。

![ry-deno.png](https://cdn.sa.net/2025/10/02/ZcsXPMk3hNWDHdB.png)

在他淡出的这段时间，前端或者说 Node.js 社区已经有很大变化了。Node.js 似乎也有一些瓶颈和问题。

但在这个视频中他坦率地讲出了自己在 Node.js 中的一些设计「缺陷」：

* 没有使用 **Promise**
* 安全性
* 构建系统（gyp）
* node_modules
* `require("module")` 时不写 `.js` 扩展名

可以看到 ry 总结的这些问题非常精准的戳到了当时 Node.js 的一些核心问题。我想经历过那个时代的程序员一定会记得：callback hell, node_modules, node-sass, gyp, fsevent...

有意思的是实际上在 Node.js 出现之间 JavaScript 回调地狱并没有那么臭名昭著，因为 Node.js 出现后使用了异步 IO 的模型，刚好回调函数的模式可以和异步 IO 很好的融合，写起来很自然。但是使用的太多了就会另人感到不适：

callback hell
```js
doSomething(function(result1) {
    doSomethingElse(result1, function(result2) {
        doAnotherThing(result2, function(result3) {
            doFinalThing(result3, function(result4) {
                console.log('Done:', result4);
            });
        });
    });
});
```

Promise
```js
doSomething()
  .then(result1 => doSomethingElse(result1))
  .then(result2 => doAnotherThing(result2))
  .then(result3 => doFinalThing(result3))
  .then(result4 => console.log('Done:', result4))
  .catch(err => console.error(err));
```

async/await
```js
async function main() {
    try {
        const result1 = await doSomething();
        const result2 = await doSomethingElse(result1);
        const result3 = await doAnotherThing(result2);
        const result4 = await doFinalThing(result3);
        console.log('Done:', result4);
    } catch (err) {
        console.error(err);
    }
}
main();
```

为了解决这些问题，他又发明了一个新东西：Deno - 一个基于 V8 的安全 TypeScript 运行时。

![ry-deno-intro.png](https://cdn.sa.net/2025/10/02/McZbN1h3OCsA5yR.png)

deno 的出现可以说解决了 Node.js 所有设计上的重大缺陷问题，并且引用了 TypeScript，这使得使用 JavaScript 编写严肃的程序、系统成为可能。

值得注意的是，早期的 deno 底层是 Go 实现的，在后来的迭代中换成了 Rust，其中一个重要的原因是：JavaScript 是一门高级程序语言，是有垃圾回收的。而 Go 也一样，如果用 Go 实现那 deno 的运行时就会有两个垃圾回收器。ry 在后来的演讲中说：有两个垃圾回收器那样不对。虽然不是不可以，但是出于程序员的直觉两个垃圾回收器是不对的。

2021-4 成立 deno 公司

2022-6 Deno 完成了红杉资本领投的2100 万美元A 轮融资，总融资额达到2600 万美元，目标是开发一款商业产品 [Deno Deploy](https://deno.com/deploy)。

我的博客也托管在 deno deploy 上，以前用过 github pages, hugo, hexo 等，但是多少还是有点问题，刚好因为自己对 JavaScript 熟悉所以一直用免费版的 deno deploy。

——

这就是 ry 到目前为止做到的事情，当然故事还在继续。毫无疑问 ry 是一个成功的程序员、工程师、老板、Node.js 社区的精神领袖。我想从我自己的视角总结几个关于他的问题，这会对我们的工作、生活有所启发。

在这之前我想有几个时间点在技术领域是非常重要的：

1. Linux 2.5.44 内核发布于 2003年6月26日，引入 [epoll](https://zh.wikipedia.org/wiki/Epoll) 大概 22 年前
2. Nginx 发布于 2004年10月4日，大概21年前
3. V8 JavaScript 引擎发布于 2008年9月2日，大概 17 年前
4. Node.js 首次发布于 2009年5月28日， 大概 16 年

epoll 在 Linux 内核中之前，大部分网站使用的服务器还是 apache。apache 服务器的模型是多线程的，一请求一线程，显然这是无法应对大量并发访问的。因为启动一个线程会有很多开销，假如：启动一个线程需要5MB的内存，那么 1G 内存的机器上就最多只能开 200 多个线程，也就意味着一台 1G 内存的电脑只能服务 200 个 HTTP 连接（用户）。

但是随着互联网的发展，大家在网上的活动越来越频繁，这才出现了大量的高流量网站，社交媒体、BBS、搜索引擎、博客、个人网站等等。一时之间网络流行起来，大家在上网的时候越来越多。

Nginx 就应运而生了，他抛弃了 apache 线程驱动模式，使用事件驱动，异步非阻塞模式。Linux 下使用 epoll 实现异步 IO。Nginx 设计之初就解决了 C10K 问题。对于 静态文件服务、反向代理、负载均衡应用场景展示出了极高的性能。

我第一次使用 Nginx 的反向代理的时候，感觉就是：哇，这是什么魔法，太神奇了。只需要一行配置就可以让 A 网站展示 B 网站的内容。

注意在这个时间节点，大概 2004 年的时候不没有任何编程语具备异步编程模型的默认范式。当时异步编程概念是很早就有了。我这里讲的默认范式可以理解成指定编程语言中的编程风格或者说语言内核。比如：Java 的 OOP，Haskell 的 FP，现在 JavaScript 中的 Promise/async/await。

显然 ry 知道 Nginx 的核心原理，他是想把异步 IO 这种模型植入到某个编程语言中去，你可以想象的到这个想法的威力有多大吗？Nginx 是一个应用层软件引入异步 IO 后有这么大的性能提升，如果把这个模型引入到一个编程语言中，那整个编程语言都是基于异步 IO 的，性能会比同步的高出很多倍，人们可以轻易的编写出高效的程序。

就像前文中讲到的， ry 也研究过其它编程语言，没有合适的。但是无意中发现 JavaScript 很合适。

V8 的出现让 chrome 浏览器在 2008–2015 年期间，市场占用率从 0 到了 53%，让整个 WEB 加速，也让 PC 时代到达了发展的顶峰。那段时间每年都会出现新的流行的东西。网络聊天，论坛BBS，个人博客，微博，团购，电商。整个互联网是一片朝气蓬勃的样子。

我自己写博客也是当时受到了韩寒、徐静蕾新浪博客的排名的热度影响。

可以想象当时大家对浏览器一种什么样的需求，大家似乎感觉不太到浏览器有多重要，但是对于 JavaScript 来讲却是暗流涌动。彼时的浏览器可以说是万花齐放：

- 遨游Maxthon - 用户用的最多的是它的书签功能，登录完书签永远可以保留
- 世界之窗-轻量级，号称“小巧、快速”，核心是 IE 内核，完美的兼容性
- 搜狗-主打双核
- UC-主打移动端
- 火狐
- Opera
- ...

最终，技术上异步IO模型被验证了正确性，V8的出现也逐步把 JavaScript 拉向了正经严肃的编程语言行列（当然目前看来很多地方还不够严肃）。然后 Node.js 的出现就显得很水到渠成。

当然如果只看到这些泛泛的趋势、苗头其实并不能很客观的解释最终为什么是 JavaScript 而不是其它语言，因为在我的职业生涯中从事 JavaScript 编程占大部分时间，所以我还是想从编程语言的角度来总结下为什么 JavaScript 比较合适的原因。

主要原因有三个：

**第一**：JavaScript 还很年轻（很初级）

选择 JavaScript 不是因为 JavaScript 这门语言好，而是因为 JavaScript 这门编程语言还很初级，当时的 JS 还处于脚本语言的范畴，人们用它来编程基本上很多时候是调用浏览器这个宿主环境提供的一些 API，比如：DOM/BOM/XHR 等。但是严肃的讲当时的 JavaScript 还只是一个玩具脚本语言。

**第二**：JavaScript 语言特性丰富

JavaScript 语言是一门看起来啥功能都有的语言。我们可以看看《JavaScript 权威指南》中的一段关于 JavaScript 的介绍

> JavaScript 是面向 web 的编程语言，是一门 **高阶的**（high-level）、**动态的**（dynamic）、**弱类型的**（untyped）**解释型**（interpreted）编程语言，适合面向对象（oop）和函数式的（functional）编程风格。JavaScript 语法源自 Java 和 C，一等函数（first-class function）来自于 Scheme，它的基于原型继承来自于 Self

可以看出来 JavaScript 啥特性都有，但实际上啥特性都不好用。这就给 ry 一个选择 JavaScript 的理由，这门编程语言上没有什么特别好的东西，才不至于它有一些默认的范式而导致语言层面引入异步 IO 会产生很大的阻力。

**第三**：JavaScript 的核心，单线程事件驱动

这个是 JavaScript 这种脚本语言被设计之初就确定好的，因为脚本语言就是用来屏蔽底层复杂性的。你很难想象如果 JavaScript 实现上提供多线程，同时又跑在浏览器里面它会把浏览器搞成什么鬼样子。

事件驱动这个好理解，因为 JavaScript 被设计出来就是要处理用户 UI 界面上的事件的。比如：用户点击按钮，提交表单。

单线程事件驱动这一点可以说是技术上最合适的一点，因为当 ry 把这个理念和编码方式与异步 IO 集成后，编写出来的代码非常简单而且容易理解。

我们可以看看 Node.js 官网上一直存在的代码片段，实现一个简单的 HTTP 服务器：

```js
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
```

这个实现就是 Node.js 的精髓：异步非阻塞 IO。8 行代码实现一个 HTTP Server，性能可以和 Nginx 媲美，这已经足以惊艳所有人。

异步编程的这种范式正在植入到 JavaScript 这门语言中。自从 JavaScript 有了这种最佳实践，异步编程的标准模型：async/await 也慢慢渗透到了其它编程语言中，Python/Rust 都有所借鉴。当然异步编程在其它编程语言里面也有实现，但是都没有在 JavaScript 中那么自然。

技术界总有一些人靠自己的本领过上了衣食无忧的生活，但是过上衣食无忧的生活这并没有什么意义，因为人生的意义总是在于创造一些东西而非享受一些结果。我想 ry 是这样的人，要不然他也不会在卖了 Node.js 得到钱之后走上一条结束自己人生的路。也正如他在自己人生关键时刻做出的选择一样：**做看得见的、能实践的事情**。

我一直认为任何事情，方向对了+人对了，那结果就是自然而然的成功。就算不成功也没有什么遗憾。

所以 Node.js 成功了，Node.js 的成功在于它开创了一个新的纪元，他为原来在前端的开发者打开了一扇门，这里大家才意识到：原来前端也可以写后端，也可以写服务端，前端也可以在更多领域实践，可以和更多的领域一起竞争。


参考资料:

* 2010-07-30 [Node.js: JavaScript on the Server](https://www.youtube.com/watch?v=F6k8lTrAE2g) Google TechTalks
* 2011-03-17 [Introduction to Node.js with Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I)   InfoQ
* 2011-04-26 [Ryan Dahl](https://tinyclouds.org/) Blog
* 2012-06-08 [Ryan Dahl: Original Node.js presentation](https://www.youtube.com/watch?v=ztspvPYybIY) jsconf
* 2024-03-22 [Node.js: The Documentary | An origin story](https://www.youtube.com/watch?v=LB8KwiiUGy0) CultRepo
