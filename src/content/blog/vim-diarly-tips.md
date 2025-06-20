---
author: ZHQ
pubDatetime: 2023-04-11T20:30:34.000+08:00
title: 'Vim常用命令速查'
featured: false
tags:
  - 'Vim'
  - 'productivity'
description: '常用Vim命令速查手册，提升编码效率的实用指南。'
---

## 基础设置

#### 启用Vim模式
```bash
# 在 Cursor 设置中启用
⌘ + ⇧ + P > 输入 "vim" > 启用 "Vim Mode"
```

#### Vim配置
```json
{
  "vim.enabled": true,
  "vim.useSystemClipboard": true
}
```

## 光标移动

#### 基础移动
```vim
h j k l    # 左下上右移动
w b        # 下/上一个单词开头
0 $        # 行首/行尾
gg G       # 文件开头/结尾
```

#### 屏幕移动
```vim
H M L      # 跳到屏幕顶部/中间/底部
zz zt zb   # 当前行移到屏幕中间/顶部/底部
⌃ + f/b    # 向下/上滚动一页
⌃ + d/u    # 向下/上滚动半页
```

#### 查找跳转
```vim
f字符 F字符  # 向后/前查找字符
t字符 T字符  # 向后/前查找字符前
%          # 在配对的括号间跳转
{ }        # 跳转到上/下一个空行
```

## 编辑操作

#### 插入模式
```vim
i a        # 当前位置/后面插入
o O        # 下一行/上一行插入
```

#### 删除操作
```vim
x          # 删除字符
dd         # 删除整行
cw         # 删除单词并进入插入模式
cc C       # 删除整行/从光标到行尾并插入
```

#### 复制粘贴
```vim
yy         # 复制当前行
p          # 粘贴
```

#### 撤销重做
```vim
u          # 撤销
⌘ + z      # 重做
```

## 文本选择

#### 基础选择
```vim
viw        # 选择当前单词
vip        # 选择当前段落
```

#### 引号/括号内选择
```vim
vi" va"    # 选择引号中的内容/包括引号
vi{ va{    # 选择花括号中的内容/包括花括号
```

## 文本处理

#### 大小写转换
```vim
guu        # 行转小写
gUU        # 行转大写
g~~        # 行大小写互换
```

#### 缩进操作
```vim
>>         # 向右缩进
<<         # 向左缩进
==         # 自动缩进
gg=G       # 自动缩进整个文件
```

## 搜索替换

#### 搜索
```vim
/pattern   # 向下搜索
?pattern   # 向上搜索
n N        # 下一个/上一个匹配
```

#### 替换
```vim
:%s/old/new/g    # 全局替换文本
```

## 高级功能

#### 宏操作
```vim
q字母      # 开始录制宏
q          # 结束录制
@字母      # 执行录制的宏
@@         # 重复执行上一次的宏
```

#### 标记跳转
```vim
ma         # 设置标记a
`a         # 跳转到标记a
`.         # 跳转到最后编辑位置
```

#### 多光标操作
```vim
gb         # 选择下一个相同的文本
gh         # 进入多光标模式
```