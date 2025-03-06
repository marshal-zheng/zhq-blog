---
author: ZHQ
pubDatetime: 2024-01-16T12:01:00Z
title: 'Git技巧：如何通过commit message模糊查询commit ID'
featured: false
draft: false
tags:
  - Git
description: '介绍几种在Git中通过commit message查找特定commit的方法，提高日常开发效率。'
---

## 场景

在日常开发项目开发中经常常需要找到某个特定的commit。比如：
- 想回滚到某个提交
- 需要cherry-pick某个改动
- 查看某个功能的提交历史

一般来讲我们可能只记得commit message中的关键词。这时就需要通过message来查找对应的commit ID。

## 常用方法

### 1. 使用git log --grep

最直接的方法是使用`git log`的`--grep`选项：

```bash
# 基本语法
git log --grep="关键词"

# 示例：查找包含"fix bug"的提交
git log --grep="fix bug"

# 忽略大小写
git log --grep="fix bug" -i
```

这个命令会显示所有匹配的commit信息，包括commit ID、作者、日期和完整的commit message。

### 2. 使用git log -S

有时候你可能只记得修改了某个功能的关键字(如你只记得添加了validatePhone这个方法名)，可以使用`-S`选项：

```bash
# 搜索添加或删除了特定字符串的提交
git log -S "搜索关键词"

# 示例：查找涉及到某个函数的修改
git log -S "validatePhone"
```

### 3. 格式化输出

如果只想看commit ID和message，可以使用`--format`选项：

```bash
# 只显示commit ID和提交信息
git log --grep="关键词" --format="%h %s"

# 包含作者和日期
git log --grep="关键词" --format="%h - %an, %ar : %s"
```

### 4. 组合使用

可以组合多个选项获得更精确的结果：

```bash
# 在特定时间范围内搜索
git log --grep="关键词" --since="2024-01-01" --until="2024-06-14"

# 在特定分支中搜索
git log main --grep="关键词"

# 查看详细的改动内容
git log -p --grep="关键词"
```

## 实用技巧

### 1. 使用正则表达式

git log --grep 支持正则表达式：

```bash
# 使用正则表达式匹配
git log --grep="fix.*bug" --regexp-ignore-case

# 匹配多个关键词（OR关系）
git log --grep="fix\|feature"
```

### 2. 输出到文件

可以将搜索结果保存到文件中：

```bash
# 将结果输出到文件
git log --grep="关键词" > commit-log.txt

# 格式化输出到CSV
git log --grep="关键词" --format="%h,%an,%ad,%s" > commits.csv
```

### 3. 创建别名

如果经常使用，可以在Git配置中创建别名：

```bash
# 添加Git别名
git config --global alias.find 'log --grep'

# 使用别名
git find "关键词"
```

## 进阶用法

### 1. 在特定文件中搜索

```bash
# 在特定文件的提交历史中搜索
git log --grep="关键词" -- path/to/file

# 组合pickaxe搜索
git log -S "关键词" --patch -- path/to/file
```

### 2. 按作者筛选

```bash
# 搜索特定作者的提交
git log --grep="关键词" --author="作者名"

# 按邮箱搜索
git log --grep="关键词" --author="@company.com"
```

## 注意事项

1. **大小写敏感**：默认搜索是大小写敏感的，需要用`-i`选项忽略大小写
2. **性能考虑**：在大型仓库中搜索时，建议加上时间范围限制
3. **转义字符**：特殊字符需要转义，比如`*`、`?`等
4. **中文支持**：确保终端支持UTF-8编码，否则中文可能显示乱码

## 总结

通过合理使用Git的搜索功能，可以快速定位到需要的commit。根据实际需求，可以：
- 用`--grep`搜索提交信息
- 用`-S`搜索代码变更
- 用`--format`自定义输出格式
- 组合多个选项精确查找