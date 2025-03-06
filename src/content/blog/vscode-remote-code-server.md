---
author: ZHQ
pubDatetime: 2024-03-11T11:33:00Z
title: '远程开发新姿势：使用VSCode控制远程code-server'
featured: false
draft: false
tags:
  - vscode
description: '介绍如何使用VSCode连接远程code-server，打造高效稳定的远程开发环境，让开发体验不受环境限制。'
---

## code-server是什么？

在线IDE已经不是一个新鲜事物了, code-server是其中一个优秀的开源项目。它由Coder公司开发，允许在远程服务器上运行VSCode并通过浏览器访问。简单来说，它是一个运行在服务器上的VSCode，开发者可以通过任何设备的浏览器来访问和使用它。

code-server的核心优势在于：

- **在任何地方工作**：只需一个浏览器就能获得完整的VSCode体验
- **资源利用**：可以利用服务器的高性能资源进行开发
- **环境统一**：团队成员共享相同的开发环境，避免"在我机器上能运行"的问题
- **安全性**：代码和开发环境都保留在服务器上，本地设备仅作为显示终端

## 为什么需要code-server？

以下场景特别适合使用code-server：

1. **资源密集型开发**：当项目需要大量计算资源（如AI模型训练、大型编译），普通笔记本可能力不从心
2. **多设备开发**：需要在家里的台式机、办公室的笔记本，甚至iPad上无缝切换开发工作
3. **团队协作**：希望团队使用一致的开发环境，避免环境差异导致的问题
4. **低配置设备开发**：使用配置较低的设备（如Chromebook）或在本地Mac上同时运行多个前端服务导致性能下降时，可以将计算密集型任务转移到服务器端

code-server完美解决了这些问题，它将强大的计算能力放在服务器上，而开发者只需通过浏览器进行操作。

## code-server与VSCode远程连接的区别

很多人会问："VSCode本身就有Remote SSH扩展，为什么还需要code-server？"

这两者有本质区别：
- **VSCode Remote SSH**：本地运行完整的VSCode客户端，通过SSH连接远程服务器
- **code-server**：服务器运行VSCode，客户端只需一个浏览器

code-server的优势在于：
1. 对客户端要求更低（只需浏览器）
2. 更适合网络条件不稳定的情况
3. 可以通过简单的URL分享开发环境
4. 便于在平板电脑等非传统开发设备上使用

## 部署code-server

### 1. 服务器安装

最简单的方式是使用官方提供的安装脚本：

```bash
curl -fsSL https://code-server.dev/install.sh | sh
```

或者使用Docker：

```bash
docker run -it --name code-server -p 8080:8080 \
  -v "$HOME/.config:/home/coder/.config" \
  -v "$PWD:/home/coder/project" \
  codercom/code-server:latest
```

### 2. 基本配置

安装后，编辑配置文件：

```bash
vim ~/.config/code-server/config.yaml
```

基本配置示例：

```yaml
bind-addr: 0.0.0.0:8080
auth: password
password: your_password
cert: false  # 开发环境可以设为false，生产环境建议配置SSL
```

### 3. 启动服务

```bash
code-server
```

现在开发者可以通过浏览器访问 `http://your-server-ip:8080` 来使用code-server了。

## 使用VSCode控制远程code-server

虽然code-server本身可以通过浏览器使用，但将其与本地VSCode结合使用体验更佳。这里有两种方式：

### 方式一：使用Remote-SSH扩展连接服务器

1. 在本地VSCode中安装"Remote - SSH"扩展
2. 配置SSH连接到运行code-server的服务器
3. 连接后，开发者可以像本地一样使用VSCode，但实际所有操作都在远程服务器上执行

```json
// .ssh/config 配置示例
Host my-dev-server
    HostName your-server-ip
    User username
    PreferredAuthentications publickey,password  (指定SSH认证方式,优先使用公钥认证,其次是密码认证)
```

### 方式二：使用OpenVSCode Server扩展

更优雅的方式是使用专门的扩展来连接code-server：

1. 在本地VSCode中安装"OpenVSCode Server"扩展
2. 使用扩展连接到远程code-server的URL
3. 享受本地VSCode的体验，同时利用远程服务器的能力

### 3. 同步设置

为了保持本地VSCode和远程code-server的设置同步,有以下几种方案:

1. **使用Settings Sync扩展**
   - 在本地VSCode和code-server中都安装Settings Sync扩展
   - 使用GitHub Gist存储配置
   - 可同步设置、快捷键、代码片段等
   - 支持自动同步,无需手动操作

2. **Git管理配置文件**
   - 将VSCode配置文件(.vscode/settings.json等)加入版本控制
   - 在不同环境clone同一份配置
   - 适合团队统一开发环境
   - 可以通过分支管理不同场景的配置

3. **使用symbolic link**
   - 将配置文件软链到统一位置
   ```bash
   # 在code-server端
   ln -s ~/.config/Code/User/settings.json ~/.local/share/code-server/User/settings.json
   ```
   - 确保配置文件路径一致
   - 适合单机多环境场景

4. **使用VSCode内置同步**
   - 登录Microsoft账号或GitHub账号
   - 开启Settings Sync功能
   - 自动同步所有VSCode配置
   - 但code-server可能需要额外配置

## 高级应用场景

### 1. 开发容器集成

将code-server与Docker开发容器结合：

```yaml
# docker-compose.yml 示例
version: '3'
services:
  code-server:
    image: codercom/code-server:latest
    ports:
      - "8080:8080"
    volumes:
      - ./project:/home/coder/project
      - ./config:/home/coder/.config
    environment:
      - PASSWORD=your_password
  database:
    image: postgres:latest
    environment:
      - POSTGRES_PASSWORD=postgres
```

### 2. 多用户环境

在团队环境中，可以为每个开发者提供独立的code-server实例：

```bash
# 使用不同端口启动多个实例
code-server --bind-addr 0.0.0.0:8081 --user-data-dir /path/to/user1/data
code-server --bind-addr 0.0.0.0:8082 --user-data-dir /path/to/user2/data
```

## 总结

通过本文的配置和技巧，开发者可以：
- 在任何设备上获得一致的开发体验
- 充分利用远程服务器的资源

无论是资源受限的笔记本用户，还是需要统一团队开发环境的项目负责人，code-server都能极大地提升开发效率和体验。