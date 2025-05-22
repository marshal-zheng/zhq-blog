---
author: ZHQ
pubDatetime: 2025-03-04T20:54:00Z
title: 'Colima + Docker CLI 替代 Docker Desktop'
featured: false
draft: false
tags:
  - docker
description: 'M 系列 Mac 上，推荐用 Colima + Docker CLI 替代 Docker Desktop'
---

作为一名以 Mac 作为主力开发平台的开发者，日常开发Docker也是必备工具, Apple Silicon (M1/M2/M3，乃至最新的 M4) Mac 的同行们都体验过官方的 Docker Desktop。启动慢、吃资源、商业版还得花钱，这些“槽点”或多或少都让我们有些不爽。

所以，我一直在寻找一个更轻量、更高效的替代方案。经过一番折腾和对比，我最终选择了 **Colima + Docker CLI** 这套组合。这篇文章，我就想和大家分享一下，如何在 M 系列 Mac (包括最新的 M4) 上，搭建这样一个清爽、免费又好用的 Docker 开发环境。

---

## ✅ 为啥不推荐（或者说，我自己不用）Docker Desktop？

在聊具体怎么做之前，我想先说说我个人为什么倾向于放弃 Docker Desktop：

*   **商业授权**：对于咱们团队使用或者有商业化需求的情况，Docker Desktop 的订阅费是个绕不开的坎。免费的午餐越来越少，能省则省嘛。
*   **作为开发者, 那个图形界面，我真用不上**：说实话，对于大部分开发者来说，Docker 的日常操作基本都是通过命令行完成的。那个庞大的图形界面，很多时候感觉就是个摆设，还拖慢了速度。
*   **资源占用和启动速度，真的“感人”**：用过的都懂，Docker Desktop 启动起来那叫一个“稳健”，内存和 CPU 占用也常常让人“眼前一亮”。
*   **Colima：轻量、开源、免费，它不香吗？**：相比之下，Colima 启动飞快，资源占用小得多，而且完全开源免费，对 Apple Silicon 的支持也非常好。

---

## 📦 上手指南：M 系列 Mac (M1/M2/M3/M4 通用) 安装步骤

好了，废话不多说，咱们直接上手。

### 1. 安装 Homebrew (如果你还没装的话)

Homebrew 算是 Mac 上包管理的“神器”了，没装的同学，一行命令搞定：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

### 2. 安装 Docker CLI 和 Colima

有了 Homebrew，安装 Docker 命令行工具和 Colima 就非常简单了：

```bash
brew install docker colima
```
这里我们只安装 `docker` 这个包，它提供的是 Docker 客户端命令行工具，而不是完整的 Docker Desktop。`colima` 则是我们今天的主角，它负责在幕后管理虚拟机和 Docker 引擎。

### 3. 启动 Colima (它会自动帮你搞定虚拟机和 Docker 引擎)

第一次启动 Colima，它会自动下载所需的虚拟机镜像并进行初始化配置。

```bash
colima start
```

如果你想对虚拟机的资源进行更精细的控制，比如分配多少 CPU 核心、内存、磁盘空间，以及指定虚拟机架构，可以在启动时加上参数：

```bash
colima start --cpu 4 --memory 4 --disk 60 --arch aarch64
```
*   `--cpu 4`：分配 4 个 CPU 核心给虚拟机。
*   `--memory 4`：分配 4GB 内存。
*   `--disk 60`：分配 60GB 磁盘空间。
*   `--arch aarch64`：明确指定使用 ARM64 架构的虚拟机，这对于咱们 M 系列芯片的 Mac 来说是最佳选择，性能最好。当然，Colima 默认也会优先选择 `aarch64`。

我个人的经验是，根据自己 Mac 的配置和日常 Docker 使用强度来调整这些参数。如果只是跑些轻量级的容器，默认配置或者稍低一些也够用。

---

## 🧪 装好了？来验证一下！

装完之后, 要确认一下环境是不是真的OK了。

### 1. 检查 Docker 是否正常

在终端里敲：

```bash
docker version
```
如果你能看到 `Client` 和 `Server` 两部分的信息，并且 `Server` 部分的 `Arch` 显示为 `aarch64`，那就说明 Docker 引擎已经通过 Colima 成功跑起来了。

### 2. 看看 Colima 的状态

再查查 Colima 本身的状态：

```bash
colima status
```
顺利的话，你会看到类似这样的输出：

```vbnet
Colima is running
Runtime: docker
Arch: aarch64
```
`Runtime: docker` 和 `Arch: aarch64` 这两行是重点，表明 Colima 正在以 Docker 模式运行，并且是 ARM64 架构。

### 3. 跑个 “Hello World” 测试一下

```bash
docker run hello-world
```
如果一切顺利，你会看到 Docker 官方的欢迎信息：

```css
Hello from Docker!
This message shows that your installation appears to be working correctly.
```
看到这个，基本上就可以放心了，你的轻量级 Docker 环境已经搭建成功！

---

## 🔧 可选但强烈推荐：配置国内镜像加速器

在国内环境下，直接从 Docker Hub 拉取镜像，速度有时候真的让人抓狂。配置一个国内的镜像加速器，能显著提升拉取速度，节省不少等待时间。我个人常用的是阿里云或者中科大的源。

配置方法很简单：

```bash
mkdir -p ~/.docker
cat <<EOF > ~/.docker/daemon.json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://mirror.baidubce.com"
  ]
}
EOF
```
这里我列了两个常用的国内镜像地址，你也可以替换成其他的，比如阿里云为你分配的专属加速器地址。

**重要：** 修改完 `daemon.json` 文件后，需要重启 Colima 才能让配置生效。

```bash
colima stop
colima start
```
或者，如果你的 Colima 版本支持 `--reload` (较新版本一般都支持)，可以更优雅地：
```bash
colima stop
colima start --reload # 或者直接 colima restart，但有时我发现 stop 再 start 更稳妥些
```
重启后，再 `docker pull` 镜像试试，速度应该会有质的飞跃。

---

## 📋 常用 Colima 命令速查表

为了方便日常使用，我整理了一些常用的 Colima 命令：

| 操作             | 命令                        | 备注                                     |
| ---------------- | --------------------------- | ---------------------------------------- |
| **启动 Colima**   | `colima start`              | 可以带资源配置参数，如 `--cpu 2 --memory 2` |
| **停止 Colima**   | `colima stop`               |                                          |
| **重启 Colima**   | `colima restart`            |                                          |
| **删除 Colima 实例** | `colima delete`             | 会删除虚拟机和所有相关数据，请谨慎操作   |
| **查看状态**     | `colima status`             |                                          |
| **SSH 进入虚拟机** | `colima ssh`                | 有时候需要进去排查问题                   |
| **查看日志**     | `colima logs`               | 或者 `colima logs -l debug` 查看更详细日志 |
| **拉取 Docker 镜像** | `docker pull <image_name>`  | Docker CLI 命令                          |
| **运行 Docker 容器** | `docker run <options> <image_name>` | Docker CLI 命令                          |

---

## 🏁 总结：轻装上阵，Docker 开发更畅快

总的来说，在 Apple Silicon Mac (无论是 M1、M2、M3 还是最新的 M4) 上，通过 **Colima + Docker CLI** 的组合，我们完全可以搭建一个比 Docker Desktop 更轻量、启动更快、资源占用更少的 Docker 开发环境。而且，它是完全开源免费的，对于商业使用也没有任何限制。

从我个人的使用体验来看，这套方案在 M 系列芯片上的表现非常出色，与之前在 Intel 架构 Mac 上使用 Docker 的体验几乎没有差异，甚至因为虚拟化技术的进步和 ARM 架构的优势，在某些场景下感觉还要更流畅一些。

无论你是前端开发者、后端工程师，还是运维同学，如果你也厌倦了 Docker Desktop 的臃肿和限制，不妨试试 Colima，相信它能给你带来更愉悦的本地容器开发体验。