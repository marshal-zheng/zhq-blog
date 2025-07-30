---
author: ZHQ
pubDatetime: 2023-08-10T11:24:00Z
title: 'MAC日常命令'
featured: false
draft: false
tags:
  - mac
  - 'productivity'
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


#### 查看 `电脑型号 芯片信息 核心数 内存大小 系统版本 显卡型号和显存大小` (紧凑版)

```bash
system_profiler SPHardwareDataType SPSoftwareDataType SPDisplaysDataType | grep -E "Model Name|Model Identifier|Chip|Memory|Cores|System Version|Chipset Model|VRAM"
```

#### 查看mac配置详细信息(抉择电脑可部署哪些LLM)

```bash
system_profiler SPHardwareDataType SPSoftwareDataType SPDisplaysDataType
```

#### 使用 Homebrew 安装 llama.cpp（跳过自动更新Homebrew直接安装需要的包,并显示详细日志）

```bash
HOMEBREW_NO_AUTO_UPDATE=1 brew install llama.cpp --verbose
```

#### 设置终端代理环境

```bash
export https_proxy=http://127.0.0.1:4780 http_proxy=http://127.0.0.1:4780 all_proxy=socks5://127.0.0.1:4781
```
> 此命令为当前终端会话设置HTTP、HTTPS和SOCKS代理，使网络请求通过指定的代理服务器。

#### 使用 rsync 复制文件夹（排除虚拟环境文件夹）

```bash
rsync -av --exclude 'venv' source_dir/ target_dir/
```
> 该命令用于高效地复制文件夹内容到目标目录，并排除名为 `venv` 的虚拟环境文件夹。  
> - `rsync`：文件和目录同步工具  
> - `-a`(archive)：归档模式，保留文件属性  
> - `-v`(verbose)：显示详细输出  
> - `--exclude 'venv'`：同步时排除 `venv` 文件夹  
> - `source_dir/`：源目录  
> - `target_dir/`：目标目录  

