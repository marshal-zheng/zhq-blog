---
author: ZHQ
pubDatetime: 2025-01-15T20:08:34.000+08:00
title: 'Git worktree使用'
featured: false
slut: 'copilot-best-practices'
tags:
  - 'git'
description: '分享 GitHub Copilot 的使用技巧和最佳实践，以提升开发效率。'
---

![git worktree 多工作区示意图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/gXbDzJ.png)


最近在捣鼓项目的时候，偶然间深入研究了一下 Git 的 `worktree` 这个功能。说实话，之前也模模糊糊知道有这么个东西，但一直没太当回事儿，总觉得现有的 `stash` 和分支切换也还能应付。不过，前阵子手头项目并行任务特别多，来回切换分支、保存和恢复工作区状态的操作实在是有点频繁和繁琐，就下定决心好好研究了一下 `worktree`，结果发现，这玩意儿一旦用顺手了，确实能显著提升并行开发的效率和体验。所以今天就想把我的这点使用心得和一些关键操作整理一下，分享出来。

在日常的软件开发工作中，我们经常会遇到需要在多个任务或多个分支之间来回切换的场景。比如，你可能正在一个特性分支上集中精力开发一个复杂的新功能，代码逻辑盘根错节，好不容易进入了“心流”状态。就在这时，可能测试环境报了一个紧急的 bug，或者产品经理又带着一个优先级更高的“小需求”找上门来，需要你立刻放下手头的工作，去处理这些突发情况。

按照以往比较传统的工作流程，这时候通常需要经历一系列略显繁琐的操作：

1.  首先，得赶紧用 `git stash` 把当前特性分支上那些改了一半、还不能直接提交的代码先临时“藏”起来。
2.  然后，用 `git checkout` 切换到一个稳定分支（比如 `main` 或 `develop`），再从这个稳定分支上切出一个新的 `bugfix` 分支或临时的需求分支。
3.  接着，在新分支上全神贯注地修复问题或实现新需求、测试、提交、推送、发起合并请求等等。
4.  等这些“插队”的任务终于告一段落，松了一口气之后，还得再用 `git checkout` 命令，小心翼翼地把分支切换回之前那个做到一半的特性分支。
5.  最后，也是最容易让人提心吊胆的一步，就是要记得用 `git stash pop` (或者 `git stash apply`) 把之前“藏”起来的那些改动给恢复回来。这时候，心里总得默默祈祷一下，希望恢复过程不要出什么幺蛾子（比如遇到一些意想不到的冲突，或者不小心 `stash drop` 了重要的改动，那就真是欲哭无泪了）。

这一整套操作下来，不仅会频繁打断宝贵的开发思路，降低工作效率，而且在 `stash` 的保存和恢复过程中，也确实存在一些潜在的操作风险和心智负担。

而 `git worktree` 这个功能，恰好就能很好地解决这类问题。

简单来说，`git worktree` 命令允许我们在**同一个本地 Git 仓库的基础上，同时拥有和管理多个完全独立的工作目录 (working trees)**。这就好比，你的主项目目录（比如 `/Users/dev/my-project`）可以一直保持在你当前正在开发的主力分支上（比如 `feature/awesome-new-thing`）；与此同时，如果来了个紧急的 bug 需要修复，你可以完全不干扰你现在这个工作目录的状态，直接在旁边（比如 `/Users/dev/my-project-hotfix`）再开辟一个新的、干净的工作目录出来，让它专门关联到你的 `bugfix` 分支。甚至，如果你手头还有第三个、第四个完全不同的任务或特性分支需要并行处理，理论上你也可以为它们各自创建专属的、隔离的工作目录。

这些不同的工作目录，虽然它们共享的是同一个底层的 `.git` 仓库数据（也就是说，所有的提交历史、对象数据、分支信息等等都是同一份，是互通的），但它们各自拥有完全独立的**工作区文件、暂存区状态和 `HEAD` 指针**。这意味着，你在一个 worktree 里做的所有操作——比如修改文件、`git add`、`git commit`、甚至在这个 worktree 内部切换分支——都完全不会影响到其他 worktree 里的状态。它们就像是同一个大型项目的不同“独立施工区域”，各自施工，互不干扰，非常清爽。

这样做最直接、最让人拍手称快的好处是什么呢？那就是，当我们需要在不同的开发任务或者不同的分支之间切换时，我们**几乎可以告别过去那种频繁执行 `git checkout` 来回切换当前工作目录分支的痛苦了，也基本上可以把 `git stash` 这个让人又爱又恨的命令打入“冷宫”了。** 我们只需要简单地在文件浏览器里切换到不同的项目目录，或者在你的 IDE（比如 VS Code，它对多工作区或多项目窗口的支持通常都相当不错）里打开不同的窗口或工作区，就能实现秒级的任务上下文切换。这种感觉，就像是你同时开了好几个轻量级的“项目分身”一样，每个“分身”专心干自己的活儿，互不影响。对于提升并行开发的效率和保持一个不被打断的开发心流，这种体验的提升，我觉得是相当显著和值得尝试的。

还是拿刚才那个十万火急修复线上 bug 的场景来举例，如果咱们用上了 `git worktree`，整个流程会变得多么从容和高效：

假设你正在你的主项目目录 `/Users/dev/my-project`（当前关联的是你正在全力开发的特性分支 `feature/new-data-visualization`）下，聚精会神地码着代码，灵感迸发。突然，警报声响起，线上一个核心功能挂了，需要立刻修复，对应的修复分支是 `hotfix/critical-payment-issue`。

#### 使用 `git worktree` 并行处理紧急修复任务的步骤

1. **查看当前的工作树配置**
   
   首先，检查当前仓库下已经存在的工作树，确保环境干净或了解已有的工作树情况。

   ```bash
   git worktree list
   ```
   输出示例：
   ```
   /Users/dev/my-project  e8a2f4c [feature/new-data-visualization]
   ```

2. **为紧急修复分支创建新的工作树**
   
   在主项目目录旁边新建一个工作树，专门用于 `hotfix/critical-payment-issue` 分支的修复工作。

   ```bash
   git worktree add ../project-hotfix-payment hotfix/critical-payment-issue
   ```
   预期输出：
   ```
   Preparing worktree (checking out 'hotfix/critical-payment-issue')
   HEAD is now at 7f3d6e8 Urgent: Fix critical payment gateway bug!
   ```

3. **再次确认工作树列表**
   
   检查新工作树是否已成功创建，并确认各自分支状态互不干扰。

   ```bash
   git worktree list
   ```
   输出示例：
   ```
   /Users/dev/my-project                   e8a2f4c [feature/new-data-visualization]
   /Users/dev/project-hotfix-payment       7f3d6e8 [hotfix/critical-payment-issue]
   ```

4. **并行处理开发任务**
   
   - 在 `/Users/dev/my-project` 目录继续开发原有特性分支。
   - 在 `/Users/dev/project-hotfix-payment` 目录专注修复紧急 bug，互不影响。

通过以上步骤，你可以高效地在多个分支和任务间切换，极大提升并行开发的效率和体验。

当你在那个临时的 `project-hotfix-payment` 目录中，成功地完成了 bug 修复、代码提交，并且将修复推送到远程仓库、合并到主线之后，如果你觉得这个临时的工作树不再需要了，就可以非常轻松地将它移除掉（具体的移除命令我们稍后会看到），不留下一丝管理的痕迹。

就我个人的使用体验而言，`git worktree` 确实极大地简化了我在多个分支或多个不同开发任务之间进行切换和并行工作的流程。它让我能够更专注于编码本身，而不是在那些繁琐的 Git 命令切换和工作状态的保存恢复上耗费过多的宝贵时间和精力。如果你也经常需要在不同的开发任务之间频繁地“跳来跳去”，

### `git worktree` 的常用命令与实践小结

下面这张表，整理了一些在实际开发中经常会用到的 `git worktree` 命令及其简要说明和示例，希望能帮助大家快速上手：

| 命令                                                     | 说明                                                                                                                                                                                                                            | 示例                                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `git worktree list`                                      | 列出当前 Git 仓库关联的所有工作树，包括主工作树（通常是最初 `clone` 的目录）和所有通过 `git worktree add` 创建的链接工作树。输出信息包含每个工作树的路径、当前 `HEAD` 提交的哈希值以及检出的分支名。                               | `git worktree list`                                                                              |
| `git worktree add <path> <branch>`                       | 在指定的文件系统路径 `<path>` 下创建一个新的链接工作树，并将指定的 `<branch>` 分支检出到这个新的工作树中。如果 `<branch>` 分支不存在，此命令通常会失败（除非结合其他选项从特定提交创建新分支）。`<path>` 可以是相对路径或绝对路径。                               | `git worktree add ../project-staging staging-branch`                                             |
| `git worktree add -b <new-branch> <path>`                | 一个便捷的组合命令。它会在指定的路径 `<path>` 下创建一个新的链接工作树，并且**同时基于当前 `HEAD` 指向的提交创建一个名为 `<new-branch>` 的新分支**，然后将这个新分支检出到新创建的工作树中。                                          | `git worktree add -b feature/dark-mode ../project-dark-mode-feature`                             |
| `git worktree add <path> <commit-ish>`                   | 除了从分支创建工作树，也可以让新的工作树直接检出某个特定的提交（`<commit-ish>` 可以是提交哈希、标签名，或任何能解析为提交对象的引用）。在这种情况下，新创建的工作树会处于“分离 HEAD (detached HEAD)”状态。这适用于代码审查、基于历史版本构建或测试等场景。 | `git worktree add ../code-review-v1.2 v1.2.0`                                                  |
| `git worktree remove [-f] <path>`                        | 用于移除指定路径 `<path>` 的链接工作树。Git 在移除前会检查该工作树中是否存在未提交的修改或未推送到远程的本地提交。如果存在，为防止数据丢失，默认会拒绝移除并提示。若确认要强制移除（例如已处理完所有重要变更，或确认未提交内容不再需要），可添加 `-f` (或 `--force`) 选项。**此命令主要移除 Git 对该工作树的管理记录和部分元数据，通常不会自动删除文件系统中的实际目录和文件内容，这些可能需要手动清理。** | `git worktree remove ../project-staging`                                                         |
| `git worktree prune`                                     | 清理 Git 内部记录的、但其对应的链接工作树目录在文件系统中已不存在的“孤儿”工作树元数据。通常在手动删除了链接工作树的目录后（例如通过 `rm -rf <path>`），可以运行此命令来同步 Git 的内部状态。                                     | `git worktree prune`                                                                             |
| `git worktree move <old-path> <new-path>`                | 将一个已存在的链接工作树从其当前的文件系统路径 `<old-path>` 移动到一个新的路径 `<new-path>`。这比手动移动目录并尝试修复 Git 内部引用的方式更安全和便捷。                                                               | `git worktree move ../temp-feature-branch ../active-feature-branch`                            |
| `git worktree lock <path> [--reason <string>]`           | 锁定指定路径 `<path>` 的链接工作树，以防止其被 `git worktree prune` 或其他自动清理机制意外移除。这对于那些被配置为自动化流程（如CI/CD构建目标）所依赖的、即使暂时未被直接操作也需保留的工作树非常有用。可以选填一个 `<string>` 作为锁定的原因记录。 | `git worktree lock ../release-build-target --reason "CI build directory for release candidate"` |
| `git worktree unlock <path>`                             | 与 `lock` 命令对应，用于解除对指定路径链接工作树的锁定，使其可以被正常地 `prune` 或 `remove`。                                                                                                     | `git worktree unlock ../release-build-target`                                                  |
