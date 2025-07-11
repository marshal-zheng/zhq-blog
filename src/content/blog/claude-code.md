---
author: ZHQ
pubDatetime: 2025-07-11T12:45:00+08:00
title: '关于Claude Code'
featured: true
draft: false
tags:
  - 'ai'
description: 'Claude code真实使用感受'
---

最近在我的开发工作流里，AI工具的使用方式悄悄发生了点变化。之前，我基本焊死在了Cursor Github Copilot上，它们那种与IDE融为一体的体验确实很顺滑。但随着项目越来越复杂，我发现自己花在“喂上下文”上的精力也越来越多，总感觉AI像个需要时刻提点的聪明实习生。

最近Gemini Claude 都退出了cli code, 刚开始体验的是Gemini, 感觉使用体验不是太好, 处于Claude在coding方面依旧遥遥领先，切换到Cluade Code上。正好最近在基于antd的官方文档项目向抽取一份自己文档底座，就用Claude Code来辅助Cursor来完成抽取过程. 因为Claude会封国内IP, 我目前用的是anyRouter赠送的100刀, 算是适用一下吧,如果好用后面会考虑单独开一个Claude code Pro, 毕竟现在也有chatgpt plus, 同时开这么多有点浪费。这里不想吹捧它有多牛，只想把我的真实使用笔记分享出来，给同样在探索AI协作方式的朋友一个参考。

![https://via.placeholder.com/800x400.png?text=Developer's+Desk+with+CLI+and+Code](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/9E82A7.png)

### 1. `/init`：从“备忘录”到可版本控制的“系统提示词”

我觉得这是Cloud Code比较核心功能。

在Cloud Code里执行`/init`命令，会在项目根目录生成一个`cloud.md`文件。刚开始我没太当回事，就随手写了些项目的基本信息，比如技术栈、数据库类型和一些内部的命名规范。

但写完后，我试着问了个关于项目里某个函数的问题，它的回答让我很意外。它不仅解释了代码本身，还联系上了我在`cloud.gmd`里提到的业务逻辑。为了搞清楚它的工作原理，我特地去翻了官方文档，有句话是这么说的：“`cloud.md` is a special file that Claude automatically pulls into context when starting a conversation.”（`cloud.md`是一个特殊文件，Claude在开始对话时会自动将其拉入上下文）。

看到这里我就明白了，这不就是AI领域里常说的“系统提示词”么？它的本质，是给AI设定一个全局的、高优先级的行为准则。

用过Github Copilot的朋友应该也会联想到GitHub Copilot中的“Instructions”功能，它们的作用很像。我简单总结了一下它们的区别：

| 特性 | Cloud Code (`cloud.md`) | GitHub Copilot (Instructions) |
| :--- | :--- | :--- |
| **载体** | 一个`.md`文件 | IDE里的一个文本框 |
| **协作** | 文件可以存入Git，团队共享 | 个人配置，不易共享 |

对我来说，**最大的区别在于`cloud.md`是一个可以被版本控制的文件**。这意味着，我们可以把这份“AI协作指南”提交到Git仓库。当团队新成员加入时，他只需要拉取代码，就能确保他本地的AI与团队其他人遵循的是同一套规则。这让AI的协作从一种个人习惯，变成了一项可管理的团队工程实践。

### 2. 计划模式：从“头脑风暴”到“审查施工图”

这个功能（快捷键`shift` + `Tab`）彻底改变了我应对复杂任务的方式。

上面提到最近在Ant Design的官方文档底座抽取过程中，为我们自己的产品线抽象一个内部的组件库底座。我们知道，Ant Design的项目非常庞大，文件结构复杂，依赖关系盘根错节。想从这里面直接抽取一个干净的基础底座，简直无从下手。

换作以前在Cursor里，我可能会开始一场漫长的“头脑风暴”：`@`整个仓库，然后问“Button组件的依赖有哪些？”、“核心的样式变量文件在哪里？”，通过无数个小问题，一点点拼凑出全貌。

这次，我试了试Cloud Code的计划模式。我直接给了它一个宏观的目标：“分析Ant Design的仓库，帮我规划如何抽取一个最小化的组件库底座。我需要包括核心的构建配置、样式系统，以及像Button、Grid、Icon这些基础组件。给我一个可执行的步骤。”

它花了几分钟时间进行分析，然后给我的不是零散的建议，而是一份格式化的`diff`文件，一份真正的“施工图”。里面清晰地列出了：
1.  **项目结构**：建议我创建一个怎样的新目录结构。
2.  **核心依赖**：一个精简版的`package.json`，只包含构建和运行底座所必需的依赖。
3.  **关键文件**：指出了哪些`.less`文件是样式系统的核心，以及需要拷贝哪些配置文件（如`.babelrc`, `tsconfig.json`）。
4.  **组件源码**：列出了构成Button、Grid等基础组件所需的最少文件集合。

这份计划当然不总是100%完美，有些细节还需要我手动调整。但它提供了一个极其宝贵的起点，让我从“不知所措”的状态，直接进入到了“审查和微调方案”的阶段。这种感觉，和在聊天框里来回拉扯是完全不同的。

### 连接IDE：一座功能够用，但体验割裂的桥

### 连接IDE：一座功能够用，但体验割裂的桥

Cloud Code毕竟是个命令行工具，代码修改最终还是要回到IDE里。它提供了与VS Code等编辑器的连接功能，可以让它做的修改直接在IDE里以diff的形式展现。

这个功能是刚需，没有它的话，在命令行和文件系统里来回核对代码变更会非常痛苦。

连接功能的设置不困难：

1. 首先，需要在VS Code中安装Claude Code插件（可以直接在扩展市场中搜索找到）
  ![Claude Code for Vscode](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/6nMcqZ.jpg)

2. 然后，在Claude Code命令行中使用`/ide`命令，选择你的IDE（如VS Code）
  ![Select Ide](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/y8Jwki.jpg)

连接成功后就会看到如下:
![Claude code connected](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/3KSbgr.jpg)

这时候你就可以让Claude开始编辑了。这里我让Claude Code更新优化Readme文件，它修改完了会确认是否应用:
![Yes or No](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/wylGop.jpg)

在没有选择应用前，你可以到VS Code中查看更改的文件，会列出diff状态（和Cursor中agent模式的效果类似）:
![Diff Status](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/nJ3C7E.jpg)

连接成功后，你会获得两个主要好处：
- Claude Code的修改会直接在VS Code中以diff形式展现
- 当你在VS Code中选中代码，Claude Code会自动感知到所选内容

虽然基本功能可用，但使用体验上还是有些割裂。它并不像Cursor或GitHub Copilot那样无缝融入编辑器。我经常需要在命令行和VS Code之间来回切换，这种上下文切换确实会打断思路。特别是在调试复杂逻辑时，这种分散注意力的体验尤为明显。

不过，相比起完全在命令行中复制粘贴代码，这个连接功能已经提供了不少便利。对于需要利用Claude强大理解能力同时又不想放弃IDE舒适环境的开发者来说，这是一个可以接受的折中方案。

### 自定义命令：一个不错的效率工具

它支持用户创建自己的命令，这算是一个不错的进阶功能。

这个功能本身很实用，但创建命令的过程有点繁琐，需要手动在特定目录里创建和编辑markdown文件，对不熟悉命令行的用户来说可能不太友好。

这里给一个简单的例子:
```bash
echo '扫面整个代码库, 并使用简易的方式解释代码库工鞥' > .claude/commands/projects-explain.md
```


### `/cost`与`/model`

如果你是API用户，那这两个命令你肯定绕不开。`/cost`用来查看开销，`/model`用来切换模型。

这让我养成了一个“精打细算”的习惯。写个注释、改个变量名，我就用便宜的Sonnet模型；需要它做复杂规划时，再切换到更强大的Opus。这种控制力是订阅制工具给不了的。

但反过来看，它也给我带来了“成本焦虑”。有时候想让它做一些天马行空的探索性尝试时，我心里总会下意识地算一笔账，这种感觉确实会束缚创造力。我个人还是更倾向于可预期的订阅制，用起来更踏实。

### 总结几句

总的来说，Cloud Code不是一个能让你“爽感飙升”的工具。它甚至有点慢热，需要你投入耐心去适应它的工作流。

它没有让我敲代码的速度变快，但确实在某些方面，比如处理复杂任务和维护大型项目时，让我感觉更省心了。它用操作上的不便，换取了对项目更深层次的理解和更严谨的工程流程。

我不会说它比Cursor更好，它们是两种完全不同的工具，服务于不同的协作场景。如果你觉得AI总是记不住你的项目背景，或者希望它能更多地参与到“思考”和“规划”中来，那么，Cloud Code可能是一个值得你花点时间去了解的选项。