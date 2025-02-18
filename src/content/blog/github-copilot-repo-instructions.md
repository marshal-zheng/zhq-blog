---
author: ZHQ
pubDatetime: 2024-08-17T18:23:34.000+08:00
title: 'GitHub Copilot 仓库级自定义说明配置指南'
featured: true
slut: 'copilot-repo-instructions'
tags:
  - 'AI'
  - 'Copilot'
description: '介绍如何为 GitHub Copilot 配置仓库级自定义说明，让 AI 助手更好地理解项目特点。'
---

接上篇个人自定义说明，今天来记录下如何配置仓库级的自定义说明。这个功能可以让团队成员共享同一套 Copilot 使用规范，提高协作效率。

## 什么是仓库级自定义说明？

仓库级自定义说明是一种让 Copilot Chat 在特定仓库中遵循项目规范的方式。通过在仓库根目录创建配置文件，可以：
- 自动为所有聊天添加项目上下文
- 统一团队的代码风格
- 共享项目特定的最佳实践

## 配置步骤

1. 打开 VS Code
2. 使用快捷键 `Command+, (Mac) / Ctrl+, (Linux/Windows)`  打开设置编辑器
3. 输入 `instruction file` 搜索
4. 选择 `Github Copilot > Preview`
5. 在右侧勾选 `Use Instruction Files`
6. 保存并关闭编辑器完成配置

![VS Code Copilot 自定义说明配置](@assets/images/vscode-copilot-custom.png)

```bash
# 目录结构示例
your-repo/
├── .github/
│   └── copilot-instructions.md
├── src/
└── README.md
```

## 配置示例

以下是一个典型的 `copilot-instructions.md` 文件示例：

```markdown
# 项目规范说明

## 技术栈规范
- 使用 Vue 3 + TypeScript 开发
- UI 框架采用 Element Plus
- 使用 Vite 作为构建工具
- 状态管理使用 Pinia
- 路由使用 Vue Router

## 代码风格
- 使用 2 空格缩进
- 使用单引号作为字符串引号
- 组件名使用 PascalCase 命名
- Props 必须指定类型
- 组件样式使用 scoped

## 使用效果

配置完成后：
1. 文件保存即生效
2. 自动附加到 Chat 提示中
3. 在引用列表中可见

## 编写建议

### 1. 有效的说明示例
```markdown
# 推荐的写法
- 使用 TypeScript 而不是 JavaScript
- API 返回使用 Snake Case 命名
- 错误处理使用 Result 类型
```

### 2. 避免的写法
```markdown
# 不推荐的写法
- 总是参考 styleguide.md 生成代码
- 使用 @terminal 回答 Git 问题
- 回答要简短，不超过1000字
```

## 优先级规则

1. **个人 vs 仓库说明**
   - 个人说明优先级更高
   - 最终提示包含两者
   - 建议避免相互冲突

2. **启用/禁用选项**
   - VS Code 设置中可控制
   - 默认启用
   - 可临时禁用

## 使用Tips

1. **分类组织**
```markdown
## 代码风格
- 缩进规则
- 命名约定
- 注释规范

## 架构规范
- 分层原则
- 依赖管理
- 错误处理

## 测试要求
- 单元测试覆盖
- 集成测试规范
- 性能测试标准
```

2. **定期维护**
   - 及时更新项目变化
   - 收集团队反馈
   - 优化使用效果

## 注意事项

1. **内容建议**
   - 保持简洁明确
   - 避免过于复杂
   - 聚焦项目特点

2. **安全考虑**
   - 最好不包含敏感信息
   - 尽可能避免泄露架构细节

3. **团队协作**
   - 达成共识后配置
   - 通知团队成员
   - 收集使用反馈

## 总结

仓库级自定义说明能帮助我们：
- 统一项目规范
- 提高团队协作
- 保持代码一致性

> **小贴士**：建议先在小型项目中试用，收集反馈后再推广到更大的项目中。好的工具应该帮助而不是限制开发! 是吧。