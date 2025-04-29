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
#### 查看当前目录下每个文件或文件夹的大小

```bash
du -sh *
```
> - `du`(disk usage)：告诉你“占了多少空间”  
> - `-s`(summarize)：只要一个总数，别列一堆子文件  
> - `-h`(human-readable)：显示成好懂的 MB、GB，不是晦涩的字节数  

#### 进入 Hugging Face 缓存目录

```bash
cd ~/.cache/huggingface/hub/
```
#### 查看用户主目录下 .cache 相关的文件或文件夹

```bash
ls -al ~ | grep .cache
```
> cache 是类Unix系统（包括macOS）通用的缓存目录，用于加速应用程序运行、节省网络流量、支持离线使用。macOS遵循这一标准，第三方工具如Python、Hugging Face等常将缓存存放于此。