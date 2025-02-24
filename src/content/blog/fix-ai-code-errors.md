---
author: ZHQ
pubDatetime: 2024-08-20T22:30:34.000+08:00
title: '高效解决 AI 代码错误：告别逐个修复的烦恼'
featured: false
slut: 'fix-ai-code-errors'
tags:
  - 'AI'
  - 'Copilot'
description: '分享如何使用推理模型批量修复 AI 生成代码中的错误，提高开发效率，避免陷入逐个修复的恶性循环。'
---

Github Copilot 有一个 `Quick Fix > fix using copilot` 功能可以快速修复单个 TypeScript 报错，但当 Copilot 没有充分考虑上下文时，容易出现顾头不顾尾的情况，按下葫芦浮起瓢，修了一个 bug 又冒出俩。分享一个高效的修复方案。

## 传统修复方式的问题

### “安琪葫芦浮起瓢” 式修复

#### 常见问题
- 逐个修复效率低下
- 修复一处冒出多处
- AI 修复可能引入新问题

#### 局部修复的局限性
- 缺乏全局视野
- 容易顾此失彼
- 陷入无休止的循环

---

## 高效方案: 选择更先进的推理能模型

推理模型普遍具有全局视野, 在代码修复中有独特优势。它们能理解代码的整体结构，避免引入新问题，并且可以一次性处理多个错误。

- O3 Mini
- O1

---
## 操作指南

<span class="text-red-500">不要急着点 "Fix Using Copilot"</span>

1. 打开 Problems 面板 (`CMD + SHIFT + P` -> `Problems`)
![AI 修复示意图](@assets/images/ai-fix-before-example.png)

2. 选择 `O3 Mini` 或 `O1` 模型
![AI 修复示意图](@assets/images/ai-fix-select-model.png)

3. 复制`PROBLEMS` 面板中的错误信息
![AI 修复示意图](@assets/images/ai-fix-select-fix-all.png)

最终修复结果:
![AI 修复示意图](@assets/images/ai-fix-after-example.png)