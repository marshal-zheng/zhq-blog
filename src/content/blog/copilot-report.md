---
author: ZHQ
pubDatetime: 2025-02-22T22:51:34.000+08:00
title: 'Copilot辅助编程研究报告'
featured: true
draft: false
tags:
  - 'AI'
  - 'Copilot'
description: '从 Github Copilot 用户转向 Cursor 的深度体验分享，详细对比两款AI编程助手的功能特点、价格方案和实际使用感受。'
---

## AI辅助编程可行性研究报告

### 1. 引言
最近公司提倡 `拥抱AI` 活动, 作为前端开发者, 冲在拥抱AI的第一线. 因使用Github Copilot比较早, 使用时间也比较长, 所以本报告旨在评估AI编程工具（如GitHub Copilot）在代码生成、注释生成、Bug检测与测试用例生成等方面的可行性。为此，我在前后端项目中使用GitHub Copilot从零到一完成了开发，并分析其辅助编程的效果。

---

### 2. 验证方案与验证思路

前后端通过采用最小化配置的项目结构，核心目标是验证GitHub Copilot从零到一实现工程化开发的能力，包括代码生成的规范性、项目模块化程度、代码质量及可维护性，同时考察其在不同功能场景下的适应性。

#### 2.1 验证方案

- 采用**最小化配置**的前端和后端项目，降低非必要技术栈对AI辅助效果的干扰。
- **前端**：使用React + TypeScript + Vite框架，确保基础功能的完整性，同时尽量减少复杂性。
- **后端**：采用Django REST Framework，选择SQLite作为数据库，以保证开发环境的简洁。

#### 2.2 验证目标

- **核心功能开发**：实现用户认证相关功能，包括登录、注册、登出及密码加密。
- **工程化标准**：确保AI生成代码尽可能符合最佳实践，包括代码结构、模块划分、可读性和可维护性。
- **代码质量**：评估代码的安全性、性能和扩展性，确保其能够适应真实项目场景。
- **AI能力评估**：衡量GitHub Copilot在代码生成、错误检测、优化建议等方面的实用性。

#### 2.3 预期挑战

- AI 可能无法严格遵循项目规范，需人工调整代码风格。
- 复杂业务逻辑可能超出 AI 生成代码的能力范围。
- AI 生成的代码可能存在潜在的安全风险，如认证和数据处理方面的漏洞。

---

### 3. 项目概述

本次研究涵盖两个项目：

- **前端项目**（React + TypeScript + Vite）
- **后端项目**（Django REST Framework）

#### 3.1 前端技术栈

- React 18
- TypeScript 5.7+
- Vite 6
- ESLint 9 (Flat Config)
- CSS Modules
- Yarn
- Cypress 端到端测试

#### 3.2 后端技术栈

- Django 4.2.x + Django REST Framework
- SQLite3
- JWT 认证
- RESTful API
- Python 3.9+
- OpenAPI 3.0 集成
- RSA 加密
- 完整的测试用例
- 统一响应格式处理

---

### 4. 后端验证示例

本节列举具体的代码示例，以展示GitHub Copilot在代码生成、优化和测试中的实际表现。

在进入开发前配置项目仓库级上下文, copilot可更好的理解项目架构

![copilot-instruction](@assets/images/copilot-instruction.png)

#### 4.1 常用列表生成示例
使用copilot生成列表接口

![copilot-list](@assets/images/django-list.png)

列表接口结果:

![copilot-list](@assets/images/django-list-result.png)

#### 4.2 单文件行内更新提高效率示例

![copilot-list](@assets/images/copilot-inline.png)

#### 4.3 通过配置全局接口返回response, 验证工程化能力

![copilot-for-business](@assets/images/copolit-for-business.png)

此处通过优化全局接口的response格式处理 验证工程化能力:

![business-verify-result](@assets/images/business-verify-result.png)

验证结果: 可以自动生成全局response格式处理 ✅ 

![business-api-verify](@assets/images/business-api-verify.png)

#### 4.4 终端报错, 验证copilot是否可以fix示例:

![copilot-fix-error](@assets/images/copilot-fix-error.png)

通过适当的提示词, 可自动修复 ✅ 

#### 4.5 终端报错, 验证copilot是否可以fix示例:

![case-explain](@assets/images/case-explain.png)

#### 4.6 验证copilot django生成测试用例能力:

![copilot-django-test](@assets/images/copilot-django-test.png)

可生成适当的测试用例 ✅ 

#### 4.7 copilot 每次自动可写测试用例:

在实现 `注册用户` 功能时, 发现copilot会自我学习, 在每次写功能是会默认写测试用例

![copilot-django-auto-test](@assets/images/copilot-django-auto-test.png)

#### 4.8 (业务需求) 咨询加密方案给出可行性建议:

![copilot-encrypt-suggest](@assets/images/copilot-encrypt-suggest.png)

给出方案后, 会额外给出前端实现:

![copilot-encrypt-suggest-frontend](@assets/images/copilot-encrypt-suggest-frontend.png)

#### 4.9 书写文档能力:

更新README文档

![copilot-write-doc](@assets/images/copilot-write-doc.png)

#### 4.10 解决实际集成问题(集成swagger要报错案例):

集成成OPenAPI3.0文档过程中, 遇到报错问题通过终端报错信息, 可提供解决方案

![copilot-swagger-error](@assets/images/copilot-swagger-error.png)

根据提供方案成功修复:

![copilot-swagger-error-fix](@assets/images/copilot-swagger-error-fix.png)

---

### 5. 前端验证示例

在进入开发前配置项目仓库级上下文, copilot可更好的理解项目架构

#### 5.1 库集成能力(辅助写代码, 集成tailwind)

前端辅助写代码, 集成tailwind

![copilot-tailwind-integrate](@assets/images/copilot-tailwind-integrate.png)

集成验证结果:

![copilot-tailwind-integrate-result](@assets/images/copilot-tailwind-integrate-result.png)

#### 5.2 辅助写e2e测试用例

AI集成端到端测试cypress

![copilot-cypress-test](@assets/images/copilot-cypress-test.png)

集成结果验证

![copilot-cypress-test-result](@assets/images/copilot-cypress-test-result.png)

#### 5.3 理解框架结构能力

识别项目文件路径, 验证结果

![copilot-file-path](@assets/images/copilot-file-path.png)

#### 5.4 根据描述自动实现前端登录页功能:

![copilot-login-page](@assets/images/copilot-login-page.png)

输出结果:

![copilot-login-page-result](@assets/images/copilot-login-page-result.png)

#### 5.4 debug排查业务问题 给出建议并解决:

通过copilot问题排查

![copilot-debug-problem](@assets/images/copilot-debug-problem.png)

#### 5.5 AI自我学习项目结构, 输出代码越来越贴近实际开发:

AI不断理解项目结构, 生成预期的内容

![copilot-self-learn](@assets/images/copilot-self-learn.png)

#### 5.6 联调过程中发现问题, 抛给AI问题, 最终修复业务bug

使用 copilot调试 给出方案并解决问题:

![copilot-debug-problem](@assets/images/copilot-debug-problem2.png)

---

### 6. GitHub Copilot 辅助开发能力评估

✅ 代码生成：AI 在前后端代码补全方面的能力评估，代码结构优化及可读性分析，代码复用性和规范性

✅ 注释生成：AI 生成的注释质量评估，代码可读性提升效果，注释风格的规范性

✅ Bug 检测与修正：AI 在代码错误检测方面的能力，Bug 修复建议的合理性，AI 发现潜在问题的能力

✅ 测试用例生成：AI 可生成测试用例的完整性，测试覆盖率分析，生成的测试代码可维护性，Cypress 端到端测试能

✅ 代码规范遵循情况：AI 生成代码的风格与项目规范的一致性，代码符合 ESLint / PEP8 等编码规范，代码结构是否符合既定项目架构，生成代码的可读性与可维护性

✅ 代码质量情况：代码逻辑是否清晰，是否存在冗余代码，代码性能达到预期，如避免不必要的计算和渲染，代码的安全性，包括 SQL 注入、XSS 攻击防护等，代码的可扩展性，是否便于未来功能迭代

❌ 创建项目未达预期：GitHub Copilot 在初始化项目结构、配置文件生成方面的表现不稳定，部分关键配置需人工调整