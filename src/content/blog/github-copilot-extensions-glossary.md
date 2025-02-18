---
author: ZHQ
pubDatetime: 2024-09-10T19:56:34.000+08:00
title: 'GitHub Copilot Extensions 术语'
featured: false
slut: 'copilot-extensions-glossary'
tags:
  - 'AI'
  - 'Copilot'
description: 'GitHub Copilot Extensions 开发中常见的术语和概念记录。'
---

学习开发 Copilot Extensions 过程中，会到很多专业术语。在此记录相关专业术语的解释。

## 核心概念
### Agent（代理）
- 一个具体的 AI 助手实现
- 可以接收用户查询
- 返回响应流
- 与 GitHub App 结合形成完整的 Copilot Extension

> 感觉像是一个智能的中间人，主要负责接收、理解用户需求，并返回合适的响应。

## 扩展工作原理

### 基本架构
```javascript
// Copilot Extensions 的基本架构
const extensionArchitecture = {
    components: {
        agent: '处理用户请求的 AI 助手',
        githubApp: '提供身份验证和权限管理',
        chatInterface: '用户交互界面',
        apiEndpoints: '处理请求的服务端接口'
    },
    workflow: [
        '用户在 Chat 中发送请求',
        'Agent 接收并处理请求',
        '调用相应的外部服务',
        '返回处理结果给用户'
    ]
};
```

### 请求处理流程

1. **初始化阶段**
```javascript
// 创建一个新的 Agent
const myAgent = new Agent({
    name: 'MyCustomAgent',
    description: '处理特定领域的请求',
    systemPrompt: `你是一个专门处理 X 领域请求的助手...`,
    
    // 定义处理方法
    async handleChat(context) {
        // 1. 解析用户请求
        const { message, codeContext } = context;
        
        // 2. 处理请求
        const result = await processRequest(message);
        
        // 3. 返回响应
        return formatResponse(result);
    }
});
```

2. **请求处理阶段**
```javascript
// 处理用户请求的具体实现
async function processRequest(message) {
    try {
        // 1. 验证请求
        validateRequest(message);
        
        // 2. 调用外部服务
        const serviceResponse = await callExternalService(message);
        
        // 3. 处理响应
        return transformResponse(serviceResponse);
        
    } catch (error) {
        handleError(error);
    }
}
```

3. **响应生成阶段**
```javascript
// 格式化响应
function formatResponse(result) {
    return {
        type: 'markdown',
        value: `处理结果：\n${result}`,
        metadata: {
            source: 'custom-agent',
            timestamp: new Date().toISOString()
        }
    };
}
```

### 关键特性

1. **上下文管理**
```javascript
// 管理对话上下文
class ConversationContext {
    constructor() {
        this.history = [];
        this.metadata = new Map();
    }
    
    addMessage(message) {
        this.history.push({
            content: message,
            timestamp: Date.now()
        });
    }
    
    getContext() {
        return {
            history: this.history,
            metadata: Object.fromEntries(this.metadata)
        };
    }
}
```

2. **错误处理**
```javascript
// 统一的错误处理
function handleError(error) {
    return {
        type: 'error',
        message: error.message,
        suggestions: [
            '检查输入参数',
            '验证服务状态',
            '查看错误日志'
        ]
    };
}
```

3. **安全控制**
```javascript
// 安全检查实现
const securityChecks = {
    validateInput(input) {
        // 输入验证
        return sanitizeInput(input);
    },
    checkPermissions(user, resource) {
        // 权限检查
        return hasPermission(user, resource);
    },
    auditLog(action) {
        // 审计日志
        logAction(action);
    }
};
```

### Copilot Extension（扩展）
- 一个特殊的 GitHub App
- 可以访问 Copilot Chat 窗口
- 可以调用 Copilot API
- 为 Copilot Chat 提供扩展功能

### Skillset（技能集）
- 一组技能的集合
- 允许开发者连接外部服务
- 最小复杂度的实现方式
- 平台自动处理提示词和响应

> 侧重于提供具体的功能和服务，Agent 像是一个整体的 AI 助手实现。通过 Skillset，开发者可以快速地将外部服务集成到 Copilot Extensions 中，而无需处理复杂的实现细节。平台会自动处理提示词和响应。

## 扩展类型

### 1. 私有扩展 (Private Extension)
```javascript
// 仅组织内部或个人可见和使用
const privateExtension = {
    visibility: 'private',
    scope: 'organization',
    features: [
        'internal_docs',
        'custom_tools',
        'sensitive_data'
    ]
};
```


### 2. 公共扩展 (Public Extension)
```javascript
// 任何 GitHub 用户都可以安装
const publicExtension = {
    visibility: 'public',
    distribution: 'unlisted',
    features: [
        'open_source',
        'community_tools',
        'public_apis'
    ]
};
```

### 3. Marketplace 扩展
```javascript
// 在 GitHub Marketplace 上发布
const marketplaceExtension = {
    visibility: 'public',
    distribution: 'marketplace',
    requirements: [
        'github_review',
        'verified_creator',
        'security_checks'
    ]
};
```

## 工具和功能

### Tool/Function Calling（工具/函数调用）
- Copilot LLM 的一项能力
- 允许调用特定工具或函数
- 开发者可以定义可用工具
- LLM 可以选择合适的工具执行

示例：
```javascript
// 定义一个工具
const tool = {
    name: 'findIssueByID',
    description: '通过 ID 查找 Issue',
    parameters: {
        id: {
            type: 'number',
            description: 'Issue ID'
        }
    }
};
```

### VS Code 扩展集成
```javascript
// Copilot 启用的 VS Code 扩展
const vsCodeExtension = {
    type: 'vscode_chat_extension',
    features: [
        'code_completion',
        'context_aware',
        'custom_commands'
    ],
    distribution: 'vscode_marketplace'
};
```

## 平台组件

### Copilot 扩展平台
- 处理身份验证
- 代理请求转发
- 连接客户端和代理插件
- 管理扩展生命周期

### GitHub App 基础设施
```javascript
// GitHub App 配置示例
const githubApp = {
    permissions: {
        repository: 'read',
        organization: 'read',
        user: 'read'
    },
    events: [
        'push',
        'pull_request',
        'issues'
    ],
    webhooks: {
        active: true,
        url: 'https://your-app.example.com/webhook'
    }
};
```

## 发布和验证

### Verified Creator（验证创建者）
- Marketplace 发布必需
- 需要通过 GitHub 审核
- 确保扩展质量和安全性

### Listed/Unlisted 扩展
```javascript
// 发布状态配置
const extensionStatus = {
    listed: {
        requiresReview: true,
        visibleInMarketplace: true,
        securityGuarantee: true
    },
    unlisted: {
        requiresReview: false,
        visibleInMarketplace: false,
        securityGuarantee: false
    }
};
```