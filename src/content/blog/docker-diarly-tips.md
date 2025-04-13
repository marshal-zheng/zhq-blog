---
author: ZHQ
pubDatetime: 2023-03-10T11:02:00Z
title: 'Docker日常命令'
featured: false
draft: false
tags:
  - docker
  - '高效开发'
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