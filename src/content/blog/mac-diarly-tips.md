---
author: ZHQ
pubDatetime: 2023-08-10T11:24:00Z
title: 'MAC日常命令'
featured: false
draft: false
tags:
  - mac
  - '高效开发'
description: '常用mac命令。'
---


#### 根据提交信息关键词搜索

```bash
git log --grep="关键词"
```

#### 快速获取本机IP

```bash
ipconfig getifaddr en0
```

#### 快速获取PID

```bash
lsof -ti :5173
```

#### 根据PID杀死进程

```bash
kill -9 99315
```
> kill用于向进程发送信号(默认是终止信号), -9表示发送SIGKILL信号, 强制杀死进程

#### 查看系统版本

```bash
system_profiler SPHardwareDataType
```

#### 查看硬件信息

```bash
system_profiler SPHardwareDataType
```

#### 查看内存使用情况

```bash
top
```