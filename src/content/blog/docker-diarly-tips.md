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
#### 查看Docker镜像中定义的环境变量

```bash
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' <镜像名:标签>
```

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


#### 批量删除镜像（匹配 wps-addon）

```bash
docker images | grep wps-addon | awk '{print $3}' | xargs -r docker rmi -f
```

#### 批量删除容器（匹配 wps-addon）

```bash
docker ps | grep wps-addon | awk '{print $1}' | xargs -r docker rm -f
```

#### 查看镜像架构

```bash
ocker image inspect <镜像名> --format='{{.Architecture}}'
```

#### 保存镜像为 .tar 文件

```bash
docker save -o 文件名.tar imageId
```

#### 上传 .tar 文件到 0.67 服务器（使用 scp）

```bash
scp wps-addon.tar root@192.168.6.67:/data/
```

#### 清理异常状态容器

```bash
docker-compose down -v
```

#### 查看容器 `镜像 ID`

```bash
docker inspect d1a6e2a8a2cf --format='{{.Image}}'
```

#### 查看容器 `镜像 ID`

```bash
docker inspect d1a6e2a8a2cf --format='{{.Image}}'
```

#### 查看容器当前状态

```bash
docker inspect d1a6e2a8a2cf --format='{{.State.Status}}'
```

#### ~/.bashrc 或 ~/.zshrc配置方法快捷批量获取信息, 执行docker-inspect-summary <container_id>

```bash
docker-inspect-summary() {
  docker inspect "$1" --format='
  Container: {{.Name}}
  ID:        {{.Id}}
  Image ID:  {{.Image}}
  Image Tag: {{.Config.Image}}
  Created:   {{.Created}}'
}
```