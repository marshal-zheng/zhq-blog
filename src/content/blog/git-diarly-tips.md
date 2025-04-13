---
author: ZHQ
pubDatetime: 2023-06-10T10:54:00Z
title: 'Git日常开发常用命令'
featured: false
draft: false
tags:
  - Git
  - '高效开发'
description: '记录日常开发中git常用命令。'
---

#### 克隆项目自定义项目名称

```bash
git clone <repo-url> <custom-folder-name>
```

#### 根据提交信息关键词搜索

```bash
git log --grep="关键词"
```

#### 根据作者名称搜索

```bash
git log --author="作者姓名"
```

#### 删除远程分支

```bash
git push origin --delete branch-name
```

#### 结合关键词和作者搜索

```bash
git log --grep="修复.*错误"
```
> 💡 Tips: 此命令将查找提交信息中包含"修复"后跟任意字符再跟"错误"的提交记录。例如可以匹配"修复登录错误"、"修复性能错误"等提交信息。



#### 查找提交信息中包含特定关键字的提交（忽略大小写）

```bash
git log --grep="性能优化" -i
```

#### 查找添加或删除了特定字符串的提交记录

```bash
git log -S "search_string"
```

#### 查看指定日期范围内的提交记录

```bash
git log --since="2022-04-01" --until="2022-05-01"
```

#### 查看今天的提交记录

```bash
git log --since="yesterday"
```
#### 查看今天的提交记录

```bash
git log --since="yesterday"
```

#### 查看仓库中最近的 10 条提交记录

```bash
git log -p -n 10
```

#### 设置本地分支的上游(跟踪)分支

```bash
git branch --set-upstream-to=origin/8.5.x
```

#### 查找两个分支的共同祖先

```bash
git merge-base branch1 branch2
```

#### 从两个分支的共同祖先开始，cherry-pick origin/branchName 分支的后续提交

```bash
git cherry-pick commitId..origin/dev
```

#### 查看所有包含8.4的tag

```bash
git tag | grep 8.4
```

#### 本地分支中包含 8.2.x 的

```bash
git branch | grep 8.2.x
```

#### 查看所有分支（本地 + 远程）中包含 8.2.x 的

```bash
git branch -a | grep 8.2.x的分支
```

#### 只查看远程分支包含8.2.x的分支

```bash
git branch -r | grep 8.2.x
```

#### 远程分支 origin/8.2.x 创建一个本地分支 8.2.x，并自动切换到它

```bash
git checkout -b 8.2.x origin/8.2.x
```

#### 将另一个分支的单个文件 checkout 到当前分支

```bash
git checkout target-branch -- src/utils/helper.js
```

#### 将其他分支的文件 checkout 到当前目录的自定义路径

```bash
git show other-branch:path/to/file > your-target-path/filename
```







