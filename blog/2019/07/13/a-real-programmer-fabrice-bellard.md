---
title: 法布里斯·贝拉 — 一个真正的程序员
date: 2019-07-13T18:33:27.464Z
categories:
  - programmer
tags:
  - programmer
---


**法布里斯·贝拉**是一位法国著名的计算机程序员，在7月9日前我对他几乎一无所知。也就在这一天他发布了 [QuickJS](https://bellard.org/quickjs/) 引擎的首个公开发行版。这个名字才进入了很多和我一样无知的前端工程师的世界里。

官网中是这么介绍 QuickJS 的：

> QuickJS 是一个精巧可嵌入的 JavaScript 引擎。它支持 [ES2019](https://tc39.es/ecma262/) 中的很多特性 — 模块、异步生成器和代理。可选支持数学扩展 — 大整型，大浮点型数和操作符重载。

主要的功能特点：

* 轻量级很方便嵌入：源代码也只有几个 C 文件，没有外部依赖，一个简单的 hello world 程序会被编译成190Kb 的 x86 代码
* 超快的解释器及启动时间：在一个普通的桌面 PC 上跑 ECMAScript 测试套件中的 56000 个用例只需要 100 秒
* 几乎完成的 ES2019 新特性支持，模块、异常生成器和完整的 Annex B 支持
* 可以将 JavaScript 源代码编译成无任何外部依赖的可执行程序，垃圾回收使用引用计数机制
* 数学扩展支持：大整型，大浮点型数、操作符重载、大整型模式、数学模式
* 使用 JavaScript 实现的具有色彩支持的命令行解释器
* 内置的微型标准库（C语言包装而成）


JavaScript 引擎在这之前只有主流的 Google V8，忽然出现这么一个项目，还是非常令人震惊的，尤其是它上面的这些特性，某种程度上让前端看到了新希望。

QuickJS 发布后不久后，便在 Hack news、Twitter 上引发了大量的讨论，我也不由得起了八卦之心。下面引用一些网友的讨论：

HN 上有网友回复到：

> Is there anything that Fabrice can’t do? I mean, FFMpeg is almost a PhD thesis in and of itself, and he still manages to find time to make TinyC, QEMU, and now this. To say I’m jealous of his skills would be an understatement.
>
> 还有什么事情是**法布里斯**不能做的吗？我的意思是，FFMpeg 几乎是一个 PhD 论文级别的项目，但是他仍然有时间写 TinyC、QEMU 现在又是 QuickJS。我对他的佩服之情已经远超「嫉妒」之心。

后面的网友也是八卦之心作祟：

> I have two questions in my mind. 我有两个问题
>
> 1.  Are there anyone on HN knows him in real life? HN 上有了解法布里斯在现实生活中的样子吗？
> 2.  Does anyone have other people in their mind who is in the same league as this man? — 大家心目中与法布里斯类似的人有哪些？
>

__第一个问题__：根据几个（有机会见到过本人）网友的描述：

> I know Fabrice a little. He’s definitely real, smart and humble. — 我知道一点关于**法布里斯**。他是肯定是一个实际存在的、聪明且谦逊人。
>
> He is definitely very humble and a very good listener. — 他绝对是一个非常谦逊、内敛人，是一个非常好的倾听者。

__第二个问题__：简单来说就是有没有和法布里斯一样利害的程序员，网友纷纷回复了自己眼中最利害的程序员名字。

1. **Dan Bernstein** — 德裔美国数学家，密码学家和程序员。埃因霍温理工大学数学与计算机科学系的个人教授。发明了chacha20算法（几乎所有的现在加密算法都在使用它）。1995年，伯恩斯坦将**伯恩斯坦诉合众国案**件提起诉讼。该案的裁决宣称软件是第一修正案下的受保护言论。此前加密算法是高度机密的，受到国家/政府管制的，而伯恩斯坦自己认为写的 Snuffle 加密算法及相关的源代码是某种意义上的言论自由，因此与美国政府打官司最后还赢了，在那之后发表自由/开源软件才被视为一种言论自由。
2. **Richard Stallman** — 理查德·马修·斯托曼，美国程序员，自由软件活动家。[GCC](https://zh.wikipedia.org/wiki/GCC "GCC")、[GDB](https://zh.wikipedia.org/wiki/GNU%E4%BE%A6%E9%94%99%E5%99%A8 "GNU调试器")、[GNU Emacs](https://zh.wikipedia.org/wiki/Emacs "Emacs") 都是他的作品
3. **Linus Torvalds** — 芬兰程序员，Linux内核的最早作者，是当今世界最著名的计算机程序员、黑客之一。他的作品 Linux、Git 或许是开源软件领域最成功的两个项目。
4. **John Carmack** — 约翰·卡马克，美国的电玩游戏程序员、id Software 的创始人之一。卡马克创造的游戏引擎被用来制作其他的第一人称射击游戏，比如《半条命》和《荣誉勋章》
5. **Rob Pike and Ken Thompson** — 肯·汤普逊，他创造了Go 语言、[B语言](https://zh.wikipedia.org/wiki/B%E8%AF%AD%E8%A8%80 "B语言")（[C语言](https://zh.wikipedia.org/wiki/C%E8%AF%AD%E8%A8%80 "C语言")的前身）。与[丹尼斯·里奇](https://zh.wikipedia.org/wiki/%E4%B8%B9%E5%B0%BC%E6%96%AF%C2%B7%E9%87%8C%E5%A5%87 "丹尼斯·里奇")同为1983年[图灵奖](https://zh.wikipedia.org/wiki/%E5%9B%BE%E7%81%B5%E5%A5%96 "图灵奖")得主。

后面还有有提到前端比较熟悉的 TJ 大神等。

法布里斯与其它程序员不同的是他似乎很少有网络社交，平常人想与他沟通只能用 email，他没有任何社交账号。如果提到 Linus，你脑海里面一定会出现那些他说过的名言：

> Talk is cheap. Show me the code, I am linus i’m your god.

Linus 的利害之处在于他说他是你的上帝，一般人连否定这句话的资格都没有。从前我也一直很崇拜 Linus，因为它比较高调，语出惊人又无法否定。法布里斯则不一样，相比而言更低调，更有传统程序员的特点。但是朴实的外表怎么能遮住人家的才华呢。

法布里斯的每个作品都是那么惊艳：

* 开源软件 FFmpeg，几乎被现在所有主流的媒体播放器使用
* 发明了贝拉公式—最快圆周率算法，这个计算 N 位 PI 的公式比传统的 BBQ 算法要快 47%
* 在PC上用软件实现 4G LTE 基站
* 使用 JavaScript 写了一个 PC 虚拟机 [Jslinux](https://zh.wikipedia.org/wiki/Jslinux "Jslinux")

QuickJS 问世后，JavaScript 之父 Brendan Eich 也坐不住了，称赞法布里斯是**超级黑客**。

![](https://i.loli.net/2019/07/13/5d297b8fad00320486.png)

实际上我觉得不应该给这些利害的程序员以程序员的「分类」，因为写代码/编程对于他们来说只是一种手段或者方法，最重要的是他们创造出来的东西会让世界上所有的人受益。
