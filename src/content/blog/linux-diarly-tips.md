---
author: ZHQ
pubDatetime: 2023-05-10T11:24:00Z
title: 'Linux日常命令'
featured: false
draft: false
tags:
  - linux
description: '常用linux命令。'
---


#### 将'user'用户加入到sudo组

```bash
usermod -aG sudo user
```

#### 验证用户是否已被添加到 sudo 组

```bash
groups user
```

#### 查看当前登录的用户

```bash
whoami
```

#### 检查.zshrc是否存在

```bash
ls -la ~/.zshrc
```
