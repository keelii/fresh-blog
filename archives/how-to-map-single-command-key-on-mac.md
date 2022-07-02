+++
title = "macOS 单独设置 command(⌘) 键点击功能"
isCJKLanguage = true
categories = ["mac"]
tags = ["keymap", "win", "command"]
date = "2017-10-03T17:10:27.464Z"
+++

由于最近全面切换工作环境到 Mac 上，快捷键基本上成了适应期的最大问题

传统意义上像 `Ctrl, Alt, Shift, Win, Option, Command` 都属于 `修饰键`，只能和其它键配合使用才可以（Ctrl+c,Ctrl+v），单独敲击并没有效果

但是 Win 键在 Windows 中被赋予了更多的功能，下面这几个系统级别的快捷键用起来是非常方便的：

* `Win + E` ⇒ 打开资源管理器
* `Win + D` ⇒ 显示桌面
* `Win + L` ⇒ 锁定计算机

之前使用过 Windows 和 Ubuntu gnome，特别方便的一点就是 super(Win) 键 **不仅** 可以做为修饰键和其它键组合使用，而且还可以响应 **单独的** 点击事件，Windows 中点击 Win 键会全局呼出 _开始菜单_ 方便我们 _查找/打开_ 应用。这样的话单独点击相当于可以少按一个按键，切找应用什么的非常快

Mac 中我通常使用 Spotlight 来快速切换程序。用惯了 Mac 的人会觉得 command 键位非常舒服好按（键位原因），这时候我希望尽可能把常用的键组织到 command 上又 **不影响** 原来的组合键，比如我有下面两个最常使用的快捷键：

* `⌘` ⇒ 呼出 Spotlight
* `⌘ + Space` ⇒ 切换输入法

然而 Mac 系统中并不允许我们这么做 🤔，于是我使用了一个改键器 [Karabiner](https://pqrs.org/osx/karabiner/) 😎

[![mac-karabiner](https://img20.360buyimg.com/devfe/jfs/t9160/329/2610957899/117091/8481138f/59d34e67Nb3bd2a2d.png)](https://img20.360buyimg.com/devfe/jfs/t9160/329/2610957899/117091/8481138f/59d34e67Nb3bd2a2d.png)

我的配置方法是使用 `Complex Modifications` 因为它允许我把修饰键改成其它按钮功能。在这里我将其改为一个没用的键位（f13 - PrtSc），因为 Spotlight 不接受单独的修饰键，所以只能这样区线救国了

然后在系统偏好设置 - 键盘 - 快捷键 中将 Spotlight 设置成 F13

[![mac-spotlight](https://img12.360buyimg.com/devfe/jfs/t9769/96/578527884/124966/ff1a2f04/59d34fbeN5b1e4775.png)](https://img12.360buyimg.com/devfe/jfs/t9769/96/578527884/124966/ff1a2f04/59d34fbeN5b1e4775.png)

注意：默认的 Complex Modifications 里面是空的，需要你手动导入一个叫 [Tapping modifier-keys produces a f-key.](https://pqrs.org/osx/karabiner/complex_modifications/#modifier_keys)。然后我们 `enable` 这条：**Press left_command alone produces F14**，噫~我们是要 map 成 F13 这里默认的是 F14，怎么改下呢。改配置文件吧，打开下面这个文件：

```bash
vim ~/.config/karabiner/karabiner.json
```

将里面的 F14 改成 F13 即可：

```json
// ...
"complex_modifications": {
    "parameters": {
        "basic.to_if_alone_timeout_milliseconds": 600
    },
    "rules": [
        {
            "description": "Press left_command alone produces F14",
            "manipulators": [
                {
                    "from": {
                        "key_code": "left_command",
                        "modifiers": { "optional": [ "any" ] }
                    },
                    "to": [ { "key_code": "left_command" } ],
                    "to_if_alone": [ { "key_code": "f14" } ],
                    "type": "basic"
                }
            ]
        }
    ]
}
```

这样基本上的完成我的需求了，打开应用只需要按一次 ⌘ 即可呼出 Spotlight，像打开 Google Chrome 只需要两个键即可 `⌘ g`、Webstorm `⌘ w`、Firefox `⌘ f` ...

> 备注：我用的机器是 Mac mini 主机 + filco 87 键盘
