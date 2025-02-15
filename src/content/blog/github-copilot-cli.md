---
author: ZHQ
pubDatetime: 2024-02-15T19:20:52.000+08:00
title: 'GitHub Copilot CLI: NLP AI 终端助手'
featured: true
slug: 'copilot-cli'
tags:
  - 'AI'
description: 'GitHub Copilot CLI 深度体验：从安装配置到实践应用，探索如何让 AI 助手简化你的命令行操作。'
---

最近我在深度使用GitHub Copilot做代码开发时，发现了一个有趣的扩展功能 - Copilot CLI。这是一款专为命令行操作设计的智能工具，可以帮助简化繁琐的命令行输入和重复性的脚本任务。这里简单分享下这个工具如何帮助我提升开发效率。

## 什么是GitHub Copilot CLI

GitHub Copilot CLI 是 GitHub 推出的最新命令行工具，旨在将人工智能的智能代码建议功能扩展到开发者的终端操作中。这款工具是 GitHub Copilot 的延伸版本，专门为那些习惯于在命令行中工作的开发者设计。通过自然语言处理和机器学习技术，Copilot CLI 能够理解并响应开发者的命令行输入，提供智能化的建议、自动化脚本生成，以及其他日常开发任务的支持。

与其图形化的兄弟工具 Copilot 不同，Copilot CLI 更侧重于在纯文本环境下的工作流优化。无论是初始化项目、执行复杂的脚本命令，还是在庞大的代码库中查找特定文件，Copilot CLI 都可以帮助开发者以更快、更准确的方式完成任务。通过简化命令行操作，减少手动输入的错误率，Copilot CLI 成为了开发者手中的一把利器，助力他们在效率和精确度上更进一步。

Copilot CLI 的核心优势在于它能够通过自然语言理解（NLU）技术，接受类似“创建一个新的 Python 项目”这样的简单命令，并自动生成相应的命令行语句。例如，当开发者输入“创建一个新的React项目”时，Copilot CLI 会自动生成所需的命令和结构，极大地简化了项目启动的过程。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/d0ca502d61524b4697fe2450859f30d3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=rU6cOS6s2YWkZF6gUsrPKTPIaKo%3D)

GitHub Copilot CLI 还会尝试逐步解释生成的命令，让开发者更清楚地了解每一个命令的作用。这种“逐步分解和解释”功能对于学习Shell命令和理解复杂命令的作用非常有帮助，尤其是对于那些希望深入理解自己执行的命令但又不熟悉命令行的开发者。

## 安装与配置

要开始使用 GitHub Copilot CLI，首先需要确保你已经拥有 GitHub Copilot 的订阅权限。只要具备相应的权限，你就可以轻松安装并配置这款工具。

#### 1. 安装 GitHub Copilot CLI

在开始安装之前，请确认你的开发环境中已经安装了 Node.js 和 npm（Node.js 的包管理器），这是安装 GitHub Copilot CLI 的必要条件。接下来，通过以下命令在终端中全局安装 GitHub Copilot CLI：

    $ npm install -g @githubnext/github-copilot-cli

该命令会将 GitHub Copilot CLI 安装在你的系统中，并将 `github-copilot-cli` 命令添加到你的 PATH 环境变量中，使其可以在任何终端会话中使用。

### 安装与配置

要开始使用 GitHub Copilot CLI，首先需要确保你已经拥有 GitHub Copilot 的订阅权限。接下来，你可以按照以下步骤进行安装和配置。

#### 1. 通过 npm 安装 GitHub Copilot CLI

GitHub Copilot CLI 的安装过程非常简单，只需通过 npm 全局安装该工具即可。以下是具体步骤：

*   **安装命令**：在终端中输入以下命令，使用 npm 全局安装 GitHub Copilot CLI：

```

$ npm install -g @githubnext/github-copilot-cli
```

该命令会将 GitHub Copilot CLI 安装在你的系统中，并将 `github-copilot-cli` 命令添加到你的 PATH 环境变量中，使其可以在任何终端会话中使用。

#### 2. 认证与配置

安装完成后，你需要进行身份认证，以便 GitHub Copilot CLI 能够与 GitHub 进行交互。以下是认证的步骤：

*   **身份认证**：在终端中运行以下命令：

<!---->

    $ github-copilot-cli auth

运行该命令后，按照屏幕上的提示进行操作。这将启动与 GitHub 的认证流程，你需要登录你的 GitHub 账号，并授权 Copilot CLI 访问你的账户。

*   **令牌存储**：一旦认证成功，生成的访问令牌将会被安全地存储在你的本地机器上，供以后使用。通常情况下，你只需要在首次安装和配置时运行该命令，以后除非有特殊需求，否则无需再次认证。

#### 3. 设置快捷命令

虽然你可以直接使用 `github-copilot-cli` 命令，但为了更方便地使用 GitHub Copilot CLI，这里推荐你为常用命令设置快捷别名。这些快捷命令不仅更容易输入，还提供了额外的功能。要设置这些快捷命令，请运行以下命令：

##### 在 Zsh 中配置快捷命令

如果你使用 `zsh` 作为默认的 Shell，请按照以下步骤操作：

1.  在当前会话中设置快捷命令：

<!---->

    $ eval "$(github-copilot-cli alias -- "$0")"

这会将 `??`, `git?`, 和 `gh?` 等快捷命令添加到当前会话中。

2.  为了在所有将来的 `zsh` 会话中使用这些快捷命令，你需要将上述命令添加到 `.zshrc` 文件的末尾：

<!---->

    $ echo 'eval "$(github-copilot-cli alias -- "$0")"' >> ~/.zshrc

3\.  重新加载 `zsh` 配置文件以使更改生效：

<!---->

    $ source ~/.zshrc

##### 在 Bash 中配置快捷命令

如果你使用 `bash` 作为默认的 Shell，请按照以下步骤操作：

1.  在当前会话中设置快捷命令：

<!---->

    $ eval "$(github-copilot-cli alias -- "$0")"

这会将 `??`, `git?`, 和 `gh?` 等快捷命令添加到当前会话中。

2.  为了在所有将来的 `bash` 会话中使用这些快捷命令，你需要将上述命令添加到 `.bashrc` 文件的末尾：

<!---->

    $ echo 'eval "$(github-copilot-cli alias -- "$0")"' >> ~/.bashrc

3\.  重新加载 `bash` 配置文件以使更改生效：

<!---->

    $ source ~/.bashrc

#### 4. 测试配置

为了确保一切设置正确，你可以运行以下测试命令：

    ?? "Show me all files in this directory"

如果命令成功执行并返回了正确的 Shell 命令，说明 GitHub Copilot CLI 已经成功安装、配置，并且快捷命令设置已生效; 如下图:

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e8e30f98aafe48d39fa3a32a6ccb3a15~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=etUUt91N%2Fx0C%2Fk%2BHTtWGVUhougc%3D)

## 使用指南与技巧

这里我们想要查看当前项目中的的所有ts文件的文件列表, 我们使用?? list ts files向copilot发送prompt得到如下结果

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a909ceb853f047f0aab92e2a15a1c983~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=nGtKfVkJMaDpbViYQA%2FXRClR6Uk%3D)

copilot给我们的结果是可以使用find . -name "\*.ts"命令, 并给出此命令的解释, 并给我了我们三个选项: 1.是否执行此命令 2.如果需要进一步的提问, 可以继续提问 3.取消提问

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/689cd2218aaa45598ac87ad0a1ad62e8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=mXhzFcCdxA12tcVa3A%2B4X2GENuY%3D)

这里我们通过鼠标上下键选择2继续补充‘忽略node\_modules下的ts文件’:

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a0dac94bcbd0483595044f4609e576c0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=gd%2FwexSXKGx%2FC0U%2Fd8yAka6HGFI%3D)

然后我们还想通过文件大小排序, 接着选择2补充:

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/bff7e9c09811425a8ece6df654ec8693~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=321BuT%2BHBwVl%2FLdAxx2EiKvnLWM%3D)

到这里我们的需求已经描述清楚了, copilot综合上面的上下文给出了最终的命令'find . -name "\*.ts" | grep -v node\_modules | xargs du -h | sort -h', 如下:

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/fb86fd2ba8fe42598d62e4af2dde0997~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=Qa4CqT8cTnxcYpuTm0%2FzrVyYXUU%3D)

最后我们选择1执行, 显示出如下结果:

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f651993f1913489dbd36f3c1e5344c32~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=cLsKc8fMWPaWt6GO2Gh%2BDUQhkrA%3D)

安装并配置好 GitHub Copilot CLI 后，你就可以开始使用它来简化命令行操作。GitHub Copilot CLI 提供了三种主要模式，每一种模式都能通过自然语言查询来生成相应的命令。

#### 1. 三种模式的基本使用

GitHub Copilot CLI 的所有三种模式都遵循相同的工作方式：通过自然语言查询描述你想要执行的任务，Copilot CLI 会尝试构建一个或一组命令来实现它。如果你对建议的命令感到满意，可以直接让 Copilot CLI 为你执行这些命令。

*   `?? `**模式**：用于将自然语言翻译为任意 Shell 命令。

例如：

    ?? "Show all running processes"

Copilot CLI 会返回一个如 `ps aux` 这样的命令，你可以选择直接运行该命令。

*   `git? `**模式**：专门用于生成 Git 命令。

例如：

    $ git? "Create a new branch called feature-x"

Copilot CLI 会生成 `git branch feature-x`，并询问你是否执行。

*   `gh? `**模式**：用于生成 GitHub CLI 命令。

例如：

    $ gh? "List all open pull requests"

Copilot CLI 会生成 `gh pr list`，并提供运行选项。

#### 2. 执行命令

在 Copilot CLI 提供了建议命令后，如果你对其满意，只需让 Copilot CLI 执行该命令. 比如我们想终止vim的进程, 但是不知道用什么指令删除, 那我们就可以做如下操作:

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/1d6ef9beb67b4e1895df46459924f534~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=8cvK9OK8hSIduBq%2F4aw338QHsOY%3D)

在和Copilot CLI交互的过程中, 我们发现它会先给出指令(Command), 然后再给出解释(Expanations), Shell 非常强大，但也很容易执行一些不可逆的操作，尤其是当你不完全理解命令的含义时。通过理解每个命令的功能，我们可以避免在终端中执行那些可能带来不可逆后果的操作。比如，使用 `rm` 命令时，误用 `-rf` 标志可能导致删除大量重要文件，因此在执行命令前，务必确保你理解其每个部分。

#### 2. Revisions (修正)

如果 GitHub Copilot CLI 生成的命令不完全符合你的要求，你可以通过修订来优化和调整命令; 下面我们用一个管理主机文件夹的例子来展示下如何使用:

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/5018aba622c44524a965d3864c17d76d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=8YmA9oL2O%2BFxa20B4NunJAap%2B6k%3D)

上图我们看到，在使用 GitHub Copilot CLI 进行文件管理时，初次输入的命令是“删除当前文件夹下的所有文件”，CLI 生成的命令是 `rm -rf ./*`，它会删除当前文件夹及其所有子目录中的文件。为了避免删除子目录中的文件，我们进行了修订，指定只删除当前文件夹中的文件，而不影响子目录的内容。修订后的命令是 `find . -maxdepth 1 -type f -exec rm {} ;`，该命令只会删除当前文件夹中的文件，并保留所有子目录及其内容。

## Shell中的注意事项

在Shell中直接编写查询时，有一些潜在的陷阱需要注意。由于许多符号在Shell中具有特殊含义，它们在传递给GitHub Copilot CLI之前就会被解释。因此，在编写查询时需要特别小心这些符号的使用。

#### 1. 特殊符号的处理

在Shell中，以下符号可能会导致查询出现问题：

*   **引号 ' 或 "，问号 ?，感叹号 !** ：这些符号通常会导致Shell语法错误，或者使Shell等待输入查询的第二行。在这种情况下，可以按 `Ctrl-C` 取消当前Shell语句，然后重新编写不包含这些符号的查询。
*   **括号 ( )，大括号 { }，方括号 \[ ]** ：这些符号也通常会导致Shell语法错误，或者使Shell等待输入查询的第二行，建议避免在查询中使用它们。
*   \*\*星号 \* \*\*：在Shell中，星号会被扩展为匹配文件和文件夹名称。这可能会导致敏感的文件名信息出现在查询中，因此在查询中使用星号时需要格外小心。
*   **管道符号 |** ：管道符号会被Shell解释为将前一个命令的输出作为下一个命令的输入。在使用GitHub Copilot CLI时，管道符号通常会导致命令失败，因为CLI是一个交互式应用程序。
*   \*\*美元符号 $** ：不要在查询中使用 `$\` 符号来引用Shell变量名。这样做会使Shell在GitHub Copilot CLI接收到查询之前扩展变量，可能会在查询中发送敏感信息。

#### 2. 如何避免这些问题

为了避免这些问题，建议在查询中完全避免使用这些符号。如果确实需要使用它们，可以通过以下方法处理：

*   **转义符号**：在符号前加上反斜杠 \`\` 进行转义。
*   **使用单引号**：将整个查询用单引号 `' ... '` 括起来，以防止Shell对特殊符号的处理。

**示例**：

假设你需要在查询中使用问号和引号，可以这样写：

    $ ?? 'How to delete "temp" files?'

通过这些技巧，你可以更安全地在Shell中编写查询，避免由于特殊符号导致的语法错误或意外行为。

## 更多示例视频

#### git?

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ac6048aa88624496916e0e8e832c1106~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=DlBICgaZJzEe7ryXJB6q2jZf8VQ%3D)

#### gh?

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/30853cee6c6c45dea62d467bde59e949~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740204856&x-orig-sign=bJRuD10HzC1z%2FW12B5Dg6uhCd2s%3D)

## 使用体验与评估

GitHub Copilot CLI 在习惯在终端处理任务的场景下非常有用，尤其是当你不知道该使用哪个命令或需要组合多个命令来完成一个操作时。然而，对于经验丰富的终端用户来说，这可能不是最佳选择。我个人更倾向于使用手册搭配GitHub Copilot提升指令的的学习实践效率，而不是100%完全依赖 GitHub Copilot。

**关于使用体验**，目前在终端中使用 Copilot CLI 对我来说还不太自然。它更像是将 ChatGPT 集成到了终端中，因此可能需要一些时间来适应。实际上，GitHub 在文档中也深情的写到：GitHub Copilot CLI 是 GitHub CLI 的一个扩展，它在终端中提供了类似聊天的界面，允许你询问和运行命令相关的问题。

对于不太有经验的开发者来说，GitHub Copilot CLI 可能会很有帮助，但他们在使用时需要格外小心。毕竟，通过实际使用命令、犯错和探索，才能更好地理解命令的工作原理。直接复制和粘贴 Copilot 提供的命令可能在长期内对学习不利。此外，某些答案可能并不准确，因此需要用户具备判断能力，确保生成的命令符合预期。

**是否值得付费？**

*   **如果你仅仅打算在终端中使用 Copilot CLI**，我认为目前还不值得为此花钱。
*   **如果你将其作为一种辅助编程的 AI 开发工具**，并且还打算使用 CLI 功能——而这一切都包含在同一价格中——我认为它确实值得投资。
