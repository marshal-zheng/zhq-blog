---
author: ZHQ
pubDatetime: 2025-06-12T18:20:00+08:00
title: '如何优雅地停止 VSCode 终端关闭后“失控”的后台服务'
featured: false
draft: false
tags:
  - 'DevOps'
description: '从使用 ps 和 grep 定位进程，到利用 kill 和 pkill 命令终止进程，再到创建自动化脚本简化操作'

---

最近在使用 `code-server` 做在线开发的时候，碰上一个挺常见的问题。

我在 VSCode 的集成终端里运行 `make run` 启动了我的 Plane 项目，它一下子启动了 `plane-server`、`plane-worker` 好几个服务，终端里也开始哗哗地刷日志，一切正常。然后，手一滑，不小心把那个终端面板给关了。

这下问题来了：服务还在后台跑着，占着端口，但我失去了对它的直接控制。想用 `Ctrl+C` 停止它？没门儿了。更麻烦的是，Plane 项目有好几个子进程，我根本记不清它们各自的 PID。想停掉它们，就只能靠 Linux 命令去一个个找，然后手动 `kill`。

下面，我就把这个排查和解决问题的过程记录下来，希望能给遇到类似情况的朋友提供一个清晰的思路。

---

## 步骤一：确认进程启动方式

首先，我们需要明确，当我们在终端里执行一个命令然后关闭终端，进程为什么还在运行。这通常是因为 `make run` 脚本内部使用了 `nohup` 或者 `&` 将进程送到了后台，使其脱离了当前终端会话的控制。

因此，我们的问题场景可以确定为：**服务是以独立的后台进程模式在运行**。

我们的目标就是：
1.  找到所有与 "Plane" 项目相关的进程。
2.  安全、高效地将它们全部终止。

---

## 步骤二：查找目标进程

要从系统中找出这些“失控”的进程，最可靠的方法是使用 `ps` 和 `grep` 的组合。

```bash
ps aux | grep plane | grep -v grep
```

*   `ps aux`: 列出当前系统所有用户的全部进程。
*   `grep plane`: 从中筛选出命令行里包含 `plane` 关键字的进程。这正是我们需要找的目标。
*   `grep -v grep`: 排除掉 `grep` 命令本身，避免干扰。

**执行后，你会看到类似这样的输出：**
```
# USER      PID    %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
hq      15432  0.0  0.1  94812  3324 ?        S    10:22   0:00 ./plane-server
hq      15433  0.0  0.1  95216  3440 ?        S    10:22   0:00 ./plane-worker
```
从输出中可以清晰地看到目标进程的 PID（进程ID），这里是 `15432` 和 `15433`。

---

## 步骤三：终止进程

获取 PID 后，我们有两种主流的方法来终止它们。

### 方法一：使用 `kill` 命令（手动精准打击）

`kill` 命令通过 PID 来操作单个或多个进程。

1.  **尝试优雅终止 (SIGTERM)**:
    ```bash
    kill 15432 15433
    ```
    这是首选方式，它会通知进程自行清理并退出。

2.  **强制终止 (SIGKILL)**:
    如果进程“顽固不化”，可以上强制手段。
    ```bash
    kill -9 <PID>
    ```
    **注意**: 强制终止可能导致数据未保存，应在优雅终止无效时使用。

### 方法二：使用 `pkill` 命令（高效一键清场）

对于需要一次性处理多个进程的场景，`pkill` 是更高效的选择。

```bash
pkill -f plane
```
*   `-f` 参数至关重要，它让 `pkill` 匹配整个进程命令行，而不只是进程名。此命令会一次性终止所有命令行中包含 `plane` 的进程，完美解决我们的问题。

---

## 步骤四：脚本化自动停止流程

每次都手动敲命令还是有些繁琐，而且容易出错。我们可以将这个流程封装成一个可重复使用的脚本。

**创建 `stop-plane.sh` 脚本：**
```bash
#!/usr/bin/env bash
#
# 功能: 查找并停止所有包含 "plane" 关键字的进程。
#

set -euo pipefail

KEYWORD="plane"

echo "[INFO] 正在查找包含关键字 '${KEYWORD}' 的进程..."
PIDS=$(ps aux | grep "${KEYWORD}" | grep -v grep | awk '{print $2}')

if [[ -z "$PIDS" ]]; then
  echo "[INFO] 未找到相关进程，无需操作。"
  exit 0
fi

echo "[INFO] 将要终止以下进程 (PID)："
# 使用 PIDS 变量来显示进程详情，更安全
ps -p $PIDS -o pid,user,command | tail -n +2

echo "[INFO] 正在发送 SIGTERM 信号..."
kill $PIDS &>/dev/null

# 等待2秒，给进程一个优雅退出的机会
sleep 2

# 重新检查仍在运行的进程，并强制终止它们
STILL_RUNNING_PIDS=$(pgrep -f "${KEYWORD}" || true)
if [[ -n "$STILL_RUNNING_PIDS" ]]; then
    echo "[WARN] 以下进程未成功退出，将强制终止 (SIGKILL)："
    echo "$STILL_RUNNING_PIDS"
    pkill -9 -f "${KEYWORD}"
fi

echo "[SUCCESS] 操作完成。"
```

**使用方法：**
1.  保存以上内容为 `stop-plane.sh`。
2.  赋予执行权限：`chmod +x stop-plane.sh`。
3.  未来再遇到同样情况，只需在任意终端执行：`./stop-plane.sh`。

---

## 总结与建议

从这次的调试过程可以看出，虽然 `code-server` 提供了极大的便利，但我们也需要掌握一些基础的 Linux 进程管理技巧来应对突发状况。

| 操作                                | 场景                             | 优点                               |
| ----------------------------------- | -------------------------------- | ---------------------------------- |
| `ps aux \| grep [keyword]`          | 手动排查，确认进程状态           | 精准、灵活                         |
| `pkill -f [keyword]`                | **快速解决问题**                 | **高效、便捷，一条命令搞定**       |
| **自动化脚本 (`stop-plane.sh`)**    | **固化解决方案，避免重复劳动**   | **健壮、可靠，可作为项目工具集成** |

为了从根源上解决这个问题，最好的方式是在项目的 `Makefile` 中提供 `start` 和 `stop` 命令，将这些管理逻辑封装起来，让团队所有成员都能以统一、简单的方式启停服务。