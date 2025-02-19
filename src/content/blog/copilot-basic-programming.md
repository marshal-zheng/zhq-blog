---
author: ZHQ
pubDatetime: 2025-02-17T20:03:00+08:00
title: 'GitHub Copilot 基本使用介绍'
featured: false
tags:
  - 'AI'
  - 'Copilot'
  - 'AI-Native'
description: 详细介绍 GitHub Copilot 的基本使用方法，包括代码补全和聊天功能的操作指南。
---

## GitHub Copilot 的三大核心功能

GitHub Copilot 主要包含两个核心功能：

1. **代码补全（Code Completion）** ✍️
2. **聊天功能（Chat）** 💬
3. **代码编辑（Code Edit）** 🔧


接下来，我们分别介绍它们的使用方法。

---

## ✨ 1. 代码补全功能（Code Completion）

![Code Completion](https://tinygif.com/images/2025/02/19/N2tgS.gif)

**代码补全** 可以帮助开发者在输入代码时，自动补全函数、方法或代码片段。

如果你想要使用建议的代码, 只需按 `Tab` 键即可。
如果不想使用, 只需按 `Esc` 键即可取消。

另一种代码补全方式是, 先输入 `todo` 注释, 然后按 `Tab` 键, 即可生成一个 `todo` 任务。

![Todo Code Completion](@assets/images/todo-completion.png)


GitHub Copilot 通过分析**当前文件的上下文**以及**相关文件**，提供智能代码建议，提升编码效率。

### 🛠️ 如何使用代码补全功能？

- **直接开始写代码**，Copilot 会自动建议代码。
- **在注释中描述代码功能**，Copilot 会自动生成对应代码。

例如，如果你想编写一个检查手机号格式的函数，只需输入 `function validatePhone`，Copilot 就会自动补全代码：

```js
function validatePhone(phone: string): boolean {
  return phone.match(/^\d{10}$/) !== null;
}
```

### 🎯 代码补全快捷键

| 操作 | macOS | Windows |
|------|-------|---------|
| **接受建议** | `Tab` | `Tab` |
| **拒绝建议** | `Esc` | `Esc` |
| **查看下一个建议** | `Option (⌥) + ]` | `Alt + ]` |
| **查看上一个建议** | `Option (⌥) + [` | `Alt + [` |
| **接受下一个单词** | `Command (⌘) + →` | `Control + →` |
| **打开多个建议** | `Ctrl + Enter` | `Ctrl + Enter` |

---

## 💬 2. 聊天功能（Chat Feature）

**GitHub Copilot Chat** 提供基于 AI 的聊天交互，让开发者可以直接在编辑器中**询问 Bug 解决方案**、**生成代码** 或 **提出编程问题**。

💡 **比 ChatGPT 更方便！**

以往使用 ChatGPT 生成代码后，需要手动复制粘贴到 VS Code。而 Copilot Chat 直接将代码写入 VS Code，提升开发体验。

### 🛠️ 如何使用 Copilot Chat？

Copilot Chat 可通过**三种方式**调用：

1. **侧边栏菜单** 📂
2. **命令面板（Command Palette）** 🎛️
3. **内联聊天（Inline Chat）** ✍️

### 🎯 侧边栏 & 命令面板调用方法

- **侧边栏方式**：点击 VS Code 右上侧的 copilot图标选中`Open Chat` 或者使用快捷键`Cmd + option + i`（macOS）/ `Ctrl + Alt + i`（Windows）可打开聊天窗口。

![Copilot Chat](@assets/images/copilot-chat.png)

- **命令面板方式**：`Command(⌘) + Shift + P`（macOS） / `Ctrl + Shift + P`（Windows），输入“chat”。

![Copilot Chat](@assets/images/command-to-chat.png)

👨‍💻 **示例：询问 AI 生成代码**

**输入问题**：
> "这里让copilot写一个邮箱校验函数"

**Copilot Chat 生成的代码**：

![Copilot Chat](@assets/images/chat-example.png)

如上图所示，你可以通过选择代码块右上角的“Copy”来复制代码，或者通过选择“Insert at Cursor Position”将代码插入到当前光标位置。

### 🎯 内联聊天（Inline Chat）

内联聊天（Inline Chat）允许在正在编辑的文件中直接使用聊天功能。

#### **🛠️ 如何使用内联聊天？**

![Inline Chat](@assets/images/inline-chat.png)

- **快捷键**：在文件中按 `Command(⌘) + I`（macOS）或 `Ctrl + I`（Windows）。
- **输入指令**：例如 `写一个域名校验的功能`
- **接受代码**：点击 **Agree** 按钮，代码将被插入。
- **拒绝代码**：点击 **Discard** 按钮，忽略建议。
- **重新生成代码**：点击 **刷新图标**，获取新的代码建议。

#### **📌 内联聊天支持的命令**

| 命令 | 说明 |
|------|------|
| `/doc` | 生成选定代码的文档 |
| `/explain` | 解释选中的代码 |
| `/fix` | 提供代码修正建议 |
| `/tests` | 生成测试用例 |

---

## 🚀 AI Agent 指令（@ & /）

GitHub Copilot 在 VSCode 中提供了多个 AI 代理，不同的代理专注执行特定的任务。以下是主要的代理及其功能说明：

#### **🔹 `@` 命令（指定 AI 代理）**

`@` 用来引用特定AI Agent。输入 @ 后，可以选择某个功能或系统，像是请求某个工具的帮助，或者了解某个功能的使用方法

| 代理             | 说明                                             |
|------------------|--------------------------------------------------|
| `@terminal`      | 终端相关操作，帮助你执行命令行操作、运行脚本或获取命令行工具的帮助。 |
| `@vscode`        | 提供与 VS Code 编辑器相关的功能支持，帮助你进行调试、插件安装等操作。 |
| `@workspace`     | 处理当前项目代码管理，提供文件浏览、代码搜索、依赖关系等帮助。 |
| `@github`           | 执行与 Git 相关的操作，如提交、分支管理、查看提交历史等。 |

#### **🔹 `/` 命令（快捷指令）**

`/`（斜杠命令）是提供快捷方式的命令，用于在 `@vscode` 和 `@workspace` 中使用的功能。

##### **@vscode 相关命令**

| 命令 | 说明 |
|------|------|
| `/api` | 生成 VS Code 扩展相关答案 |
| `/search` | 使用 VS Code 的搜索功能查找代码或文件 |

##### **@workspace 相关命令**

| 命令 | 说明 |
|------|------|
| `/explain` | 解释选中的代码或文件 |
| `/fix` | 提供代码修正建议 |
| `/tests` | 生成测试用例 |
| `/new` | 创建新文件或文件夹 |
| `/newNotebook` | 创建新的 Jupyter Notebook |

##### **其他快捷命令**

| 命令 | 说明 |
|------|------|
| `/clear` | 清除聊天记录 |
| `/help` | 获取 GitHub Copilot Chat 帮助信息 |

## 🛠️ 上下文变量（#）

在 GitHub Copilot 中，`#` 符号用于在聊天提示中添加上下文变量，以提供更精确的代码建议。这些上下文变量帮助 Copilot 理解当前的工作环境，从而生成更相关的代码片段。下面是常用的上下文变量及其功能：

| 上下文变量           | 说明                                                                 |
|----------------------|----------------------------------------------------------------------|
| `#changes`           | 将源代码管理中的更改列表添加为聊天提示的上下文。                     |
| `#codebase`          | 将相关的工作区内容作为上下文添加到提示中。                           |
| `#editor`            | 将活动编辑器的可见内容添加为提示的上下文。                           |
| `#selection`         | 将当前编辑器中的选择内容添加为提示的上下文。                         |
| `#terminalSelection` | 将当前终端中的选择内容添加为聊天提示的上下文。                       |
| `#terminalLastCommand` | 将上次运行的终端命令添加为聊天提示的上下文。                       |
| `#VSCodeAPI`         | 将 VS Code 的 API 添加为提示的上下文，用于询问与 VS Code 扩展开发相关的问题。 |
| `#file`              | 打开一个快速选择，允许你从工作区中选择一个文件，并将其作为提示的上下文。 |
| `#<文件名>`          | 输入 `#` 后，键入文件名，可以获取工作区文件的建议，并将其作为上下文添加。 |


通过使用这些上下文变量，GitHub Copilot 能够更好地理解你的开发环境，从而提供更准确和相关的代码建议。✨


---

## 🔥 结论：GitHub Copilot 提高开发效率！

✅ **代码补全让开发更高效** 🎯  
✅ **聊天功能让 Bug 解决更智能** 🎯  
✅ **AI Agent 提供更智能的代码管理** 🎯  
