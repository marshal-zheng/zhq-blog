---
author: ZHQ
pubDatetime: 2023-03-10T11:02:00Z
title: 'Docker日常命令'
featured: false
draft: false
tags:
  - docker
  - 'productivity'
description: '常用docker命令。'
---

#### 查看容器内环境变量（实时查看）

```bash
docker exec <容器ID或容器名> env
```

#### 查看容器启动时配置的环境变量（包括 Dockerfile 和 run -e 设置的）

```bash
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' <容器ID或容器名>
```

#### 查看容器启动时配置的环境变量（包括 Dockerfile 和 run -e 设置的）

```bash
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' <容器ID或容器名>
```

#### 通过关键字模糊查找运行中的容器

```bash
docker ps | grep keyword
```

#### 强制删除一个运行中的容器

```bash
docker rm -f <容器ID或容器名>
```

#### 先停止容器，再删除

```bash
docker stop <容器ID或容器名>
docker rm <容器ID或容器名>
```

#### 删除所有已停止的容器

```bash
docker container prune
```

#### 删除所有容器（包括运行中的）

```bash
docker rm -f $(docker ps -aq)
```