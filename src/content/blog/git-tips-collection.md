---
author: ZHQ
pubDatetime: 2024-06-15T10:00:00Z
modDatetime: 2024-06-16T11:03:00Z
title: 'Git命令速查手册'
featured: true
draft: false
tags:
  - Git
description: '实用Git命令和技巧的速查手册，帮助解决日常开发中的常见问题。持续更新中。'
---

## 速查索引

- [提交操作](#提交相关技巧)
  - [修改最后一次提交](#1-修改最后一次提交)
  - [部分暂存文件](#2-部分暂存文件)
  - [提交空目录](#3-提交空目录)
  - [临时保存工作进度](#4-临时保存工作进度)
- [分支管理](#分支管理技巧)
  - [创建切换分支](#1-创建并切换到新分支)
  - [查看分支状态](#2-查看已合并和未合并的分支)
  - [清理分支](#3-删除已合并的分支)
  - [重命名分支](#4-重命名分支)
- [历史查看](#历史查看与搜索)
  - [美化日志输出](#1-美化日志输出)
  - [按条件过滤提交](#2-按作者或日期过滤提交)
  - [搜索提交内容](#3-查找特定内容的提交)
  - [查看文件历史](#4-查看文件的修改历史)
  - [查找共同祖先](#5-查找分支的共同祖先)
- [撤销恢复](#撤销与恢复操作)
  - [撤销工作区修改](#1-撤销工作区的修改)
  - [撤销暂存区修改](#2-撤销暂存区的修改)
  - [撤销提交](#3-撤销提交)
  - [版本回退](#4-回退到特定版本)
- [远程仓库](#远程仓库操作)
  - [多仓库管理](#1-添加多个远程仓库)
  - [修改仓库URL](#2-修改远程仓库url)
  - [清理远程分支](#3-清理远程删除的分支)
  - [多仓库推送](#4-推送到多个远程仓库)
- [配置优化](#git配置优化)
  - [全局忽略文件](#1-设置全局忽略文件)
  - [命令别名](#2-配置常用别名)
  - [自动纠错](#3-自动纠正命令)
  - [编辑器设置](#4-设置默认编辑器)
- [工作流优化](#工作流优化)
  - [交互式变基](#1-交互式变基)
  - [冲突解决](#2-自动化冲突解决)
  - [工作现场管理](#3-保存和恢复工作现场)
  - [多工作区](#4-使用worktree管理多工作区)
- [Git钩子](#git钩子应用)
  - [自动测试](#1-提交前自动运行测试)
  - [提交信息检查](#2-提交信息格式检查)
  - [自动版本更新](#3-推送前自动更新版本号)

## 提交相关技巧

### 1. 修改最后一次提交

```bash
# 修改最后一次提交（包括提交信息）
git commit --amend

# 只修改提交信息
git commit --amend -m "新的提交信息"

# 添加忘记的文件后，不修改提交信息
git add 忘记的文件
git commit --amend --no-edit
```

### 2. 部分暂存文件

```bash
# 交互式添加
git add -p 文件名

# 然后根据提示选择
# y - 暂存这块修改
# n - 不暂存这块修改
# s - 尝试将当前修改拆分成更小的块
# e - 手动编辑当前块
```

### 3. 提交空目录

```bash
# 创建空目录并添加.gitkeep文件
mkdir -p path/to/empty/directory
touch path/to/empty/directory/.gitkeep
git add path/to/empty/directory/.gitkeep
```

### 4. 临时保存工作进度

```bash
# 保存当前工作进度
git stash save "正在进行的功能开发"

# 查看保存的所有stash
git stash list

# 恢复最近的stash并删除它
git stash pop

# 恢复指定的stash
git stash apply stash@{2}

# 删除所有stash
git stash clear
```

## 分支管理技巧

### 1. 创建并切换到新分支

```bash
# 创建新分支并切换（Git 2.23+）
git switch -c 新分支名

# 旧版本的方式
git checkout -b 新分支名
```

### 2. 查看已合并和未合并的分支

```bash
# 查看已经合并到当前分支的分支
git branch --merged

# 查看尚未合并到当前分支的分支
git branch --no-merged
```

### 3. 删除已合并的分支

```bash
# 删除本地已合并的分支
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# 删除远程已合并的分支（需谨慎使用）
git branch -r --merged | grep -v main | sed 's/origin\///' | xargs -n 1 git push --delete origin
```

### 4. 重命名分支

```bash
# 重命名当前分支
git branch -m 新名称

# 重命名指定分支
git branch -m 旧名称 新名称
```

## 历史查看与搜索

### 1. 美化日志输出

```bash
# 单行显示提交历史
git log --oneline

# 图形化显示分支历史
git log --graph --oneline --decorate --all

# 为上面的命令创建别名
git config --global alias.logline "log --graph --oneline --decorate --all"
# 然后可以直接使用：git logline
```

### 2. 按作者或日期过滤提交

```bash
# 查看特定作者的提交
git log --author="用户名"

# 查看特定日期范围的提交
git log --since="2023-01-01" --until="2023-12-31"
```

### 3. 查找特定内容的提交

```bash
# 搜索提交信息中包含特定文本的提交
git log --grep="关键词"

# 搜索代码变更中包含特定文本的提交
git log -S "代码关键词"

# 搜索特定文件的历史
git log -- path/to/file
```

### 4. 查看文件的修改历史

```bash
# 查看文件的每一行是谁在什么时候修改的
git blame path/to/file

# 只查看特定行范围
git blame -L 10,20 path/to/file
```

### 5. 查找分支的共同祖先

```bash
# 查找两个分支的共同祖先提交
git merge-base branch1 branch2

# 查找多个分支的共同祖先
git merge-base branch1 branch2 branch3

# 查找所有可能的共同祖先（如果有多个）
git merge-base --all branch1 branch2

# 检查一个提交是否是另一个提交的祖先
git merge-base --is-ancestor 可能的祖先提交 目标提交
echo $? # 返回0表示是祖先，返回1表示不是
```

merge-base命令的实际应用场景：

```bash
# 查看当前分支与main分支的差异（从分叉点开始）
git diff $(git merge-base main HEAD) HEAD

# 查看从分叉点开始的所有提交
git log $(git merge-base main HEAD)..HEAD

# 创建一个补丁，只包含从分叉点开始的更改
git format-patch $(git merge-base main HEAD)

# 快速检查一个分支是否已经合并到另一个分支
git merge-base --is-ancestor feature main && echo "已合并" || echo "未合并"
```

## 撤销与恢复操作

### 1. 撤销工作区的修改

```bash
# 撤销单个文件的修改
git checkout -- path/to/file

# 撤销所有修改（Git 2.23+）
git restore .

# 旧版本的方式
git checkout -- .
```

### 2. 撤销暂存区的修改

```bash
# 将文件从暂存区移回工作区
git reset HEAD path/to/file

# 新版本的方式
git restore --staged path/to/file
```

### 3. 撤销提交

```bash
# 创建一个新提交，撤销指定提交的修改
git revert 提交ID

# 撤销最近的一次提交
git revert HEAD
```

### 4. 回退到特定版本

```bash
# 软回退（保留修改在暂存区）
git reset --soft 提交ID

# 混合回退（保留修改在工作区）
git reset --mixed 提交ID

# 硬回退（丢弃所有修改）
git reset --hard 提交ID
```

## 远程仓库操作

### 1. 添加多个远程仓库

```bash
# 添加另一个远程仓库
git remote add 仓库别名 仓库URL

# 查看所有远程仓库
git remote -v

# 从特定远程仓库拉取
git pull 仓库别名 分支名
```

### 2. 修改远程仓库URL

```bash
# 修改origin的URL
git remote set-url origin 新URL
```

### 3. 清理远程删除的分支

```bash
# 查看哪些远程分支已被删除
git remote prune origin --dry-run

# 清理已删除的远程分支引用
git remote prune origin
```

### 4. 推送到多个远程仓库

```bash
# 配置推送到多个仓库
git remote set-url --add --push origin 第一个仓库URL
git remote set-url --add --push origin 第二个仓库URL

# 现在git push会同时推送到两个仓库
```

## Git配置优化

### 1. 设置全局忽略文件

```bash
# 创建全局忽略文件
echo ".DS_Store\n.idea/\n*.swp\n*.swo" > ~/.gitignore_global

# 配置Git使用该文件
git config --global core.excludesfile ~/.gitignore_global
```

### 2. 配置常用别名

```bash
# 配置常用命令的简短别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

### 3. 自动纠正命令

```bash
# 启用自动纠正，当你输入git comit时会提示你是否想运行git commit
git config --global help.autocorrect 1
```

### 4. 设置默认编辑器

```bash
# 设置使用VS Code作为默认编辑器
git config --global core.editor "code --wait"

# 使用vim
git config --global core.editor "vim"
```

## 工作流优化

### 1. 交互式变基

```bash
# 对最近的5个提交进行交互式变基
git rebase -i HEAD~5
```

### 2. 自动化冲突解决

```bash
# 使用指定工具解决冲突
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 当遇到冲突时运行
git mergetool
```

### 3. 保存和恢复工作现场

```bash
# 创建工作进度快照，但不改变工作区
git stash save --keep-index "工作描述"

# 创建包含未跟踪文件的stash
git stash save -u "包含新文件的工作"
```

### 4. 使用worktree管理多工作区

```bash
# 创建新的工作区
git worktree add ../path-to-new-worktree 分支名

# 列出所有工作区
git worktree list

# 删除工作区
git worktree remove ../path-to-worktree
```

## Git钩子应用

### 1. 提交前自动运行测试

创建`.git/hooks/pre-commit`文件：

```bash
#!/bin/sh
npm test

# 如果测试失败，阻止提交
if [ $? -ne 0 ]; then
  echo "测试失败，提交被拒绝"
  exit 1
fi
```

### 2. 提交信息格式检查

创建`.git/hooks/commit-msg`文件：

```bash
#!/bin/sh
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "提交信息不符合规范: $commit_msg"
  echo "格式应为: type(scope): message"
  exit 1
fi
```

### 3. 推送前自动更新版本号

创建`.git/hooks/pre-push`文件：

```bash
#!/bin/sh
current_branch=$(git symbolic-ref --short HEAD)

if [ "$current_branch" = "main" ]; then
  npm version patch
  git add package.json
  git commit -m "chore: bump version"
fi
```

## 参考资源

- [Git官方文档](https://git-scm.com/doc)
- [Pro Git书籍](https://git-scm.com/book/zh/v2)
- [Git Tower学习资源](https://www.git-tower.com/learn/)

---
