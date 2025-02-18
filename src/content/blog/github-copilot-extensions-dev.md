---
author: ZHQ
pubDatetime: 2024-08-17T19:30:34.000+08:00
title: 'GitHub Copilot Extensions 开发扩展功能'
featured: false
slut: 'copilot-extensions-dev'
tags:
  - 'AI'
  - 'Copilot'
description: '介绍 GitHub Copilot 扩展，集成外部工具和服务。'
---

Copilot 文档更新了，个人开发者可以扩展 Copilot Chat 功能。今天就来分享下如何开发 Copilot Extensions。

## 什么是 Copilot Extensions?

Copilot Extensions 是一种可以扩展 Copilot Chat 功能的集成工具，允许开发者将外部工具、服务和自定义行为引入到 Chat 体验中。主要用途包括：

- **查询文档**: 集成第三方文档服务
- **AI 辅助编码**: 使用第三方 AI 模型提供代码建议
- **数据检索**: 查询第三方数据服务
- **执行操作**: 在外部系统中执行特定操作

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

## 扩展的可见性选项

Copilot Extensions 提供三种可见性选项：

1. **私有扩展**
   - 需要更多数据访问控制 (如敏感数据、用户信息等)
   - 需要集成内部文档和数据库 (如内部知识库、业务系统等)
   - 有严格的安全策略 (如合规要求、审计需求等)

2. **公共扩展**
   - 适合开源项目
   - 跨组织协作开发

3. **Marketplace 扩展**
   - 面向更广泛的受众 (适合开发通用工具和服务)
   - 集成到 GitHub 工作流 (如代码审查、CI/CD等)
   - 利用 GitHub 生态系统 (如Actions、Packages等)

## 扩展开发方式有两种

### 一. Skillsets（技能集）
轻量级的扩展方式，适合：
- 快速开发简单功能 (如文档查询、代码格式化等)
- 配置简单 (只需基础设置)
- 开发部署方便 (适合快速验证想法)

特点：
- 自动处理路由
- 自动处理提示词
- 自动处理响应生成

### 二. Agents（代理）
复杂集成的扩展方式，适合：
- 需要完全控制请求处理 (如自定义路由、请求验证等)
- 需要集成其他 LLM (如 Claude、Gemini 等)
- 需要管理对话上下文 (如多轮对话、状态保持等)

特点：
- 自定义逻辑实现
- 灵活的工作流程
- 最大的定制化空间

## 上下文传递

为了让扩展能够访问编辑器上下文（如当前打开的文件），需要：

1. **权限配置**
```json
{
    "permissions": {
        "copilotEditorContext": "read"
    }
}
```

2. **最佳实践**
   - 明确说明需要的上下文
   - 实现适当的错误处理
   - 在没有上下文时提供备选方案
   - 请求最小必要权限

## 开发资源

GitHub 提供了多个示例项目供参考：

1. **Blackbeard**
```javascript
// 简单的海盗风格回复示例
const blackbeard = new CopilotAgent({
    systemPrompt: "You are a pirate. Respond in pirate speak.",
    // ...其他配置
});
```

2. **GitHub Models**
```javascript
// 与不同 LLM 交互的示例
const modelsAgent = new CopilotAgent({
    models: ['gpt-4', 'claude-2', 'gemini-pro'],
    // ...其他配置
});
```

3. **Function Calling**
```go
// Go 语言的函数调用示例
func handleFunctionCall(ctx context.Context, req *Request) (*Response, error) {
    // 实现函数调用逻辑
    return &Response{
        // 返回结果
    }, nil
}
```

### 扩展的优势

1. **上下文感知**
   - 自动检测使用的组件
   - 分析代码中的问题
   - 提供针对性建议

2. **实时文档**
   - 自动获取最新文档
   - 提供版本相关信息
   - 包含社区最佳实践

3. **智能建议**
   - 性能优化建议
   - 代码质量改进
   - 组件使用技巧
