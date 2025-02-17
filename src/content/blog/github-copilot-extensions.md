---
author: ZHQ
pubDatetime: 2024-05-22T19:11:34.000+08:00
title: 'GitHub Copilot 扩展功能介绍'
featured: false
slut: 'copilot-extensions'
tags:
  - 'AI'
  - 'Copilot'
description: '介绍 GitHub Copilot Extensions 的使用方法和功能特点，更好地集成外部工具，提升开发效率。'
---

最近发现 Copilot 新增了扩展功能，可以在 Chat 中集成外部工具，感觉很有意思。分享记录下。

## 什么是 Copilot Extensions?

Copilot Extensions 是一种特殊的 GitHub App，它可以让我们在 Copilot Chat 中集成外部工具。这些扩展可以：
- 由任何人开发
- 用于私人或公共用途
- 通过 GitHub Marketplace 分享

> **注意**: Copilot Extensions 与 IDE 中的 Copilot 扩展不同，后者是用于基础功能的扩展。

## 如何开始使用？

有两种方式可以开始使用 Copilot Extensions：

1. **安装现有扩展**
   - 从 GitHub Marketplace 安装
   - 需要相应的订阅权限
   - 遵循安装指引

2. **构建自己的扩展**
   - 参考[官方开发文档](https://docs.github.com/zh/copilot/building-copilot-extensions/about-building-copilot-extensions)
   - 根据需求自定义功能
   - 可以私用或发布

## 支持的平台

目前支持的客户端和 IDE：
- Visual Studio Code
- Visual Studio
- GitHub.com
- GitHub Mobile
- JetBrains IDE
- GitHub Codespaces
- Vim
- Copilot CLI
- Xcode

## 上下文传递

扩展可以访问不同的上下文信息，具体取决于使用环境：

```javascript
// VS Code 和 Visual Studio 可访问的上下文
{
    client: {
        file: true,      // 当前文件
        selection: true  // 选中内容
    },
    github: {
        repository: true,  // 仓库信息
        currentUrl: false  // 当前 URL
    }
}

// GitHub.com 可访问的上下文
{
    github: {
        repository: true,
        currentUrl: true,
        resources: true  // 其他 GitHub 资源
    }
}
```

## 使用示例

### 1. 基础使用
以 Docker 扩展为例，展示如何在项目中使用 Copilot Extensions：

#### 安装步骤
1. 访问 [GitHub Marketplace](https://github.com/marketplace?type=apps&copilot_app=true) 找到 Docker 扩展
2. 点击安装并授权
3. 如果 VS Code 之前已经打开，需要重新加载窗口（Command + Shift + P > Reload Window）
4. 在Chat中按照提示授权 登录docker网站
5. 此时在 Copilot Chat 中就可以使用 @docker 命令了

```bash
# 1. 分析 Dockerfile
@docker 分析我的Dockerfile
# Docker 扩展会分析当前 Dockerfile 并提供优化建议：
# - 基础镜像选择
# - 构建步骤优化
# - 安全性建议

# 2. 优化镜像大小
@docker 如何减少镜像尺寸?
# Docker 扩展会提供具体的优化建议：
# - 使用多阶段构建
# - 清理不必要的依赖
# - 优化层的顺序

# 3. 生成配置文件
@docker 为我的 Node.js 应用和 MongoDB 创建 docker-compose.yml
# Docker 扩展会根据项目需求生成配置：
# - 服务定义
# - 网络设置
# - 数据卷配置
```

> **提示**：使用 Docker 扩展时，最好确保项目中有 Dockerfile 或 docker-compose.yml 文件，这样扩展可以提供更准确的建议。