---
author: ZHQ
pubDatetime: 2024-03-22T19:45:00+08:00
title: '简述环境变量'
featured: false
draft: false
tags:
  - 'tech'
description: '生成式AI、大型语言模型与嵌入模型'
---

日常的开发工作中，环境变量是一个每天都会接触的基础概念。从本地开发时配置 `.env` 文件，到在 CI/CD 流水线中注入参数，再到通过 Docker 和 Kubernetes 管理应用配置， 这些都是常用的场景。

这篇文章的初衷 是要重新审视这个基础工具，理清它从何而来，如何演变，以及为何在今天依然是现代软件架构的核心组成部分。

![代码和配置的结构图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/Xuydgt.jpg)

### 问题的起点：硬编码的困境

在环境变量出现之前，软件开发面临一个普遍的难题：<span class="text-red-500 font-bold">配置与代码的紧密耦合</span>

应用的运行参数，如文件路径、数据库地址、端口号等，通常被直接写在源代码中，即“硬编码”。这种做法的弊端非常明显：

*   **缺乏灵活性**：任何配置的变更都需要修改代码、重新编译和部署，流程繁琐且低效。
*   **可移植性差**：同一个程序部署到不同的环境（如从开发环境到测试环境）需要进行大量代码修改，维护成本极高。

这种模式严重制约了软件的复用和规模化部署，问题的解决亟需一种能将配置从代码中分离出来的机制。

### Unix 的解决方案：代码与配置分离

环境变量作为一种优雅的解决方案，首次出现在 1979 年的 Unix 第 7 版中。它的出现与 Unix 的核心设计哲学——“小而专的工具，通过组合完成复杂任务”——密不可分。为了让工具能灵活组合，它们的行为必须是可配置的，而不是写死的。

其实现机制巧妙地利用了 `fork()` 和 `exec()` 这两个系统调用：

1.  当一个父进程（如 Shell）需要执行一个新程序时，它首先通过 `fork()` 创建一个子进程。这个子进程是父进程的完整副本，包括了父进程的环境变量。
2.  在子进程调用 `exec()` 来执行新程序代码之前，它有机会修改继承来的环境变量副本。
3.  当 `exec()` 执行后，新的程序将在子进程的上下文中运行，并继承那份被修改过的环境。

这个过程在操作系统层面提供了一种标准化的机制，用于在程序启动时向其传递外部配置，从而实现了代码与环境的关键解耦。

### 两种实现路径：Unix-like 与 Windows

尽管核心思想一致，但在不同的操作系统中，环境变量的实现细节和管理方式有所差异。

**在 Unix/Linux 系统中：**

*   **大小写敏感**，并约定俗成地使用大写字母命名（如 `PATH`）。
*   区分 **Shell 变量**和**环境变量**。只有通过 `export` 命令声明的变量，才会被子进程继承。这是一种明确的作用域控制，避免了内部状态的意外传递。
*   配置的持久化依赖于一套**分层的文本文件**，如系统的 `/etc/profile` 和用户的 `~/.bashrc`。这种方式透明且易于通过脚本自动化管理。

**Shell 变量与环境变量的区别：**

```bash
# Shell 变量 - 仅在当前 shell 中有效
MY_VAR="local value"

# 环境变量 - 可被子进程继承
export MY_ENV_VAR="global value"

# 验证区别
echo $MY_VAR        # 输出：local value
echo $MY_ENV_VAR    # 输出：global value

# 启动子进程测试
bash -c 'echo $MY_VAR'     # 输出：空（子进程无法访问）
bash -c 'echo $MY_ENV_VAR' # 输出：global value
```

**环境变量的优先级机制：**

Unix/Linux 系统中的环境变量遵循严格的优先级规则，这种设计让用户和应用程序可以灵活地覆盖系统默认设置：

1. **当前进程设置的环境变量**（优先级最高）
2. **父进程传递的环境变量**（通过 fork() 继承）
3. **用户配置文件中的环境变量**（如 ~/.bashrc）
4. **系统级配置文件的环境变量**（如 /etc/profile，优先级最低）

**直接赋值与export的关键区别：**

在Shell中，变量的声明方式决定了它的可见范围：

```bash
# 直接赋值（Shell变量）- 只在当前Shell可见
MYVAR="local value"

# 使用export（环境变量）- 可被子进程继承
export EXPORTED_VAR="global value"

# 验证区别
./my_script.sh  # 脚本可以访问EXPORTED_VAR，但看不到MYVAR
```

直接赋值的变量（Shell变量）类似于编程语言中的局部变量，而export的变量（环境变量）则更像全局变量。这种设计允许程序只暴露必要的配置，保持内部变量的隔离性，从而提高系统的安全性和可维护性。

这种分层设计的实际意义是：开发者可以在项目级别设置特定的环境变量，用户可以在个人配置中覆盖系统默认值，而系统管理员则可以设置全局的基础配置。

**分层配置文件的加载顺序：**

1. **系统级别**：`/etc/profile` → `/etc/profile.d/` 下的脚本
2. **用户级别**：`~/.bash_profile` → `~/.bashrc` → `~/.bash_logout`
3. **非登录 shell**：直接读取 `~/.bashrc`

这种分层设计允许系统管理员设置全局默认值，同时给用户完整的自定义权限，体现了 Unix 系统的多用户设计哲学。

**在 Windows 系统中：**

*   <span class="text-red-400 font-bold">大小写不敏感</span>，变量通过 `%VAR%` 语法引用。
*   配置主要通过一个中心化的**注册表**（Registry）进行持久化管理，分为系统变量和用户变量。
*   管理上更侧重于**图形化界面**（GUI），虽然也提供命令行工具 (`set`/`setx`)，但其设计哲学更偏向于为普通用户提供直观的操作方式。

**Windows 环境变量的层次结构：**

```cmd
# 查看当前进程的环境变量
set

# 设置临时变量（仅当前会话）
set TEMP_VAR=value

# 设置持久化用户变量
setx USER_VAR "user value"

# 设置持久化系统变量（需要管理员权限）
setx SYSTEM_VAR "system value" /M
```

**注册表存储位置：**

- **系统变量**：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment`
- **用户变量**：`HKEY_CURRENT_USER\Environment`

**PowerShell 中的现代化管理：**

```powershell
# 查看环境变量
Get-ChildItem Env:

# 设置环境变量
$env:NEW_VAR = "value"

# 永久设置（需要额外步骤）
[Environment]::SetEnvironmentVariable("PERM_VAR", "value", "User")
[Environment]::SetEnvironmentVariable("PERM_VAR", "value", "Machine")
```

**MacOS 的特殊情况：**

作为 Unix-like 系统，macOS 基本遵循 Unix 规范，但有一些独特之处：

- **GUI 应用的环境变量**：通过 `launchctl` 管理，因为 GUI 应用不从 shell 启动
- **系统完整性保护 (SIP)**：限制了某些系统级环境变量的修改
- **多 shell 支持**：默认从 bash 转向 zsh，配置文件也相应变化

```bash
# macOS 特有的环境变量管理
launchctl setenv GLOBAL_VAR "value"
launchctl unsetenv GLOBAL_VAR

# 查看 GUI 应用可见的环境变量
launchctl getenv GLOBAL_VAR
```

**现代开发中的跨平台考虑：**

这种差异在现代开发中带来了挑战，催生了多种解决方案：

1. **容器化技术**：Docker 提供了统一的环境变量接口，屏蔽了底层操作系统差异
2. **跨平台工具**：如 `direnv`、`dotenv` 等，提供了一致的环境变量管理体验
3. **CI/CD 平台**：GitHub Actions、GitLab CI 等提供了统一的环境变量注入机制

<span class="text-green-500">这两种路径反映了不同的设计取向：Unix 强调文本化、脚本化和灵活性；而 Windows 侧重于集中化管理和图形界面的易用性。在云原生时代，这些差异正在被标准化工具和平台所抽象，但了解底层机制仍然对调试和优化具有重要意义。</span>


![不同操作系统的配置管理方式对比](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/A2g4j2.jpg)

### 现代软件开发中的演进与应用

DevOps 和云原生时代，环境变量的重要性不减反增，其应用场景也变得更加丰富和复杂。

使用环境变量存储数据库密码、API 密钥等敏感信息，虽然避免了硬编码，但引入了新的安全问题。环境变量在进程内存中通常是明文存储的，容易通过日志、调试工具或不当的系统访问泄露。

为了应对这一挑战，业界转向使用专业的**秘密管理工具**（如 HashiCorp Vault, AWS Secrets Manager）。在这一模式下，环境变量的角色发生了变化：不再直接存储敏感值，而是存储用于从安全服务中获取秘密的凭证或引用。这标志着配置安全从简单的“隐藏”走向了专业的“加密和权限管理”。

**自动化与容器化：新的应用范式**

*   **Docker**：通过 `ENV` 指令和运行时参数，环境变量成为构建**不可变镜像（Immutable Images）**并实现动态配置的核心。同一个镜像可以通过注入不同的环境变量，在不同环境中以不同配置运行。
*   **Kubernetes**：将配置管理提升到了编排层，提供了 `ConfigMap` 和 `Secret` 两种原生 API 对象。它们将配置与应用本身解耦，允许平台以声明式的方式、大规模地管理和注入环境变量到容器中，极大地增强了系统的自动化和可维护性。

#### 总结

环境变量的演进历程，清晰地反映了软件工程对**解耦、可移植性和自动化**的持续追求。

始于一个解决硬编码问题的简单机制，而后成为 Unix 哲学的基石，并最终演变为支撑现代云原生应用动态配置的核心技术。理解它的原理和局限性，有助于我们在今天的技术选型和架构设计中，做出更合理的决策——什么时候可以直接使用它，什么时候应该采用更专业的配置或秘密管理方案。

这个看似简单的 `KEY=VALUE`，是软件开发史上一个基础而又影响深远的设计。
### 相关资源引用

1. **官方文档**
  - [Unix 环境变量手册页](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap08.html) - POSIX 标准对环境变量的定义
  - [Windows 环境变量文档](https://docs.microsoft.com/en-us/windows/win32/procthread/environment-variables) - Microsoft 官方文档

2. **环境变量管理工具**
  - [direnv](https://direnv.net/) - 目录级环境变量管理工具
  - [dotenv](https://github.com/motdotla/dotenv) - Node.js 环境变量加载工具
  - [chamber](https://github.com/segmentio/chamber) - AWS 参数存储的命令行工具

3. **容器与云原生**
  - [Docker 环境变量文档](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file)
  - [Kubernetes ConfigMap 指南](https://kubernetes.io/docs/concepts/configuration/configmap/)
  - [HashiCorp Vault](https://www.vaultproject.io/) - 秘密管理解决方案