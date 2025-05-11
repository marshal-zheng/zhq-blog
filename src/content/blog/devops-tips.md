---
author: ZHQ
pubDatetime: 2023-08-10T11:55:00Z
title: '运维常用命令'
featured: false
draft: false
tags:
  - 'devops'
description: '运维常用命令清单'
---

#### 快速获取本机IP

```bash
ipconfig getifaddr en0
```

#### 强制更新SSL证书

```bash
certbot renew --force-renewal
```

#### 测试证书更新（不实际更新）

```bash
certbot renew --dry-run
```

#### 查看端口占用

```bash
lsof -i :端口号
```

#### 查看某进程的详细信息

```bash
ps aux | grep 进程名
```

#### 杀死指定端口的进程

```bash
kill -9 $(lsof -t -i:端口号)
```

#### 查看磁盘使用情况

```bash
df -h
```

#### 查看目录大小

```bash
du -sh 路径
```

#### 实时查看日志输出

```bash
tail -f /var/log/xxx.log
```

#### 查找大文件

```bash
find / -type f -size +100M
```

#### 查看内存使用情况

```bash
free -h
```

#### 查看CPU使用率

```bash
top
```

#### 查看网络连接

```bash
netstat -tunlp
```

#### 查看当前登录用户

```bash
who
```

#### 查看系统负载

```bash
uptime
```

#### 查看系统版本

```bash
cat /etc/os-release
```

#### 查看当前目录下所有文件（含隐藏文件）

```bash
ls -al
```

#### 递归查找文件内容

```bash
grep -rn '关键字' 路径
```

#### 复制文件夹

```bash
cp -r 源目录 目标目录
```

#### 移动文件或目录

```bash
mv 源 目标
```

#### 删除文件夹

```bash
rm -rf 目录名
```

#### 修改文件权限

```bash
chmod 755 文件名
```

#### 修改文件所有者

```bash
chown 用户:用户组 文件名
```

#### 查看环境变量

```bash
echo $PATH
```

#### 编辑环境变量

```bash
vim ~/.bash_profile
```

#### 使环境变量生效

```bash
source ~/.bash_profile
```

#### 查看当前进程树

```bash
pstree -p
```

#### 查看某端口监听情况

```bash
ss -lntp | grep 端口号
```

#### 查看所有服务状态（systemd）

```bash
systemctl list-units --type=service
```

#### 启动服务

```bash
systemctl start 服务名
```

#### 停止服务

```bash
systemctl stop 服务名
```

#### 重启服务

```bash
systemctl restart 服务名
```

#### 查看服务状态

```bash
systemctl status 服务名
```

#### 设置服务开机自启

```bash
systemctl enable 服务名
```

#### 取消服务开机自启

```bash
systemctl disable 服务名
```

#### 查看定时任务

```bash
crontab -l
```

#### 编辑定时任务

```bash
crontab -e
```

#### 查看历史命令

```bash
history
```

#### 清空历史命令

```bash
history -c
```

#### 查看当前目录下文件数

```bash
ls | wc -l
```

#### 查看某用户的进程

```bash
ps -u 用户名
```

#### 查看某文件最近10行

```bash
tail -n 10 文件名
```

#### 查看某文件前10行

```bash
head -n 10 文件名
```

#### 查看所有网络接口信息

```bash
ifconfig -a
```

#### 测试网络连通性

```bash
ping -c 4 目标IP
```

#### 下载文件

```bash
wget URL
```

#### 上传文件到远程服务器

```bash
scp 文件名 用户@远程IP:目标路径
```

#### 远程登录服务器

```bash
ssh 用户@远程IP
```

#### 查看当前目录磁盘占用排行

```bash
du -sh * | sort -hr | head -20
```

#### 查找最近修改的文件

```bash
find . -type f -mtime -1
```

#### 查看所有打开的文件句柄数

```bash
lsof | wc -l
```

#### 查看某用户登录历史

```bash
last 用户名
```

#### 查看系统启动日志

```bash
journalctl -b


