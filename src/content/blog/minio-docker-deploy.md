---
author: ZHQ
pubDatetime: 2025-08-31T20:43:00.000+08:00
title: 'MinIO 快速部署手册（HTTP 直连，预留 HTTPS 升级位）'
featured: false
draft: false
tags:
  - minio
description: '一份针对内网环境的 MinIO 快速部署指南，基于 Docker Compose，包含 HTTP 直连配置、Traefik+Let''s Encrypt 的 HTTPS 升级占位、常见命令、mc 与 aws-cli 使用示例及故障排查。'
---

好的，这是格式化后的MinIO快速部署手册：

```markdown
# MinIO 快速部署手册（HTTP 直连，预留 HTTPS 升级位）

本手册基于您已确认的账号口令：`admin / admin1234`。我们将先部署一个HTTP直连的MinIO服务（适用于内网），并预留Traefik + Let's Encrypt的HTTPS占位，以便后续随时切换。

## 环境与目标

- **系统:** Debian/Ubuntu (CentOS/RHEL 安装指南附在文末)
- **运行方式:** Docker + Docker Compose (Compose 插件)
- **数据目录:** 宿主机 `/srv/minio/data` (与配置分离，容器重建不丢数据)
- **控制台端口:** `9001` (HTTP)
- **S3 API 端口:** `9000` (HTTP)
- **示例服务器 IP:** `192.168.0.67` (请按需替换为您的实际服务器地址)

---

## 步骤 0：安装 Docker 与 Compose

### Debian/Ubuntu

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
 | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
 | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 将当前用户加入 docker 组（重新登录 shell 或执行 newgrp 生效）
sudo usermod -aG docker $USER
newgrp docker
```
CentOS/RHEL 安装命令请参考文末附录。

---

## 步骤 1：准备目录（配置与数据分离）

```bash
sudo mkdir -p /opt/minio-stack/traefik /srv/minio/data
sudo touch /opt/minio-stack/traefik/acme.json && sudo chmod 600 /opt/minio-stack/traefik/acme.json
sudo chown -R $USER:$USER /opt/minio-stack /srv/minio
cd /opt/minio-stack
```

---

## 步骤 2：创建 `.env` 文件（请把 IP 换成你的服务器地址）

```bash
cat > .env <<'EOF'
TZ=Asia/Shanghai

# —— 对外可达地址（用于签名URL与控制台跳转）——
PUBLIC_API_ENDPOINT=http://192.168.0.67:9000
PUBLIC_CONSOLE_ENDPOINT=http://192.168.0.67:9001

# —— 预留 HTTPS/域名，占位即可（启用 HTTPS 时再改为真实域名/邮箱）——
MINIO_API_DOMAIN=s3.example.com
MINIO_CONSOLE_DOMAIN=console.example.com
LETSENCRYPT_EMAIL=you@example.com

# —— 初始化账号密码（你指定的）——
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin1234

MINIO_REGION=us-east-1
EOF
```
**注意：** 如果之后要更换地址（例如从 `127.0.0.1` 改为 `192.168.0.67`），修改 `.env` 后务必执行 `docker compose down && docker compose up -d` 让环境变量生效。

---

## 步骤 3：创建 `docker-compose.yml`（HTTP 直连可用，HTTPS 占位）

```yaml
version: "3.9"

services:
  # --- 未来启用 HTTPS 时再解注释本服务，并去掉 minio 的端口映射 ---
  # traefik:
  #   image: traefik:v3.1
  #   container_name: traefik
  #   command:
  #     - "--api.dashboard=false"
  #     - "--providers.docker=true"
  #     - "--providers.docker.exposedbydefault=false"
  #     - "--entrypoints.web.address=:80"
  #     - "--entrypoints.websecure.address=:443"
  #     - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
  #     - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
  #     - "--certificatesresolvers.le.acme.email=${LETSENCRYPT_EMAIL}"
  #     - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
  #     - "--certificatesresolvers.le.acme.tlschallenge=true"
  #   ports:
  #     - "80:80"
  #     - "443:443"
  #   volumes:
  #     - "./traefik/acme.json:/letsencrypt/acme.json"
  #     - "/var/run/docker.sock:/var/run/docker.sock:ro"
  #   restart: unless-stopped
  #   environment:
  #     - TZ=${TZ}

  minio:
    image: quay.io/minio/minio:latest
    container_name: minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
      MINIO_REGION: ${MINIO_REGION}
      MINIO_SERVER_URL: "${PUBLIC_API_ENDPOINT}"
      MINIO_BROWSER_REDIRECT_URL: "${PUBLIC_CONSOLE_ENDPOINT}"
      TZ: ${TZ}
    volumes:
      - "/srv/minio/data:/data"
      # --- 单机多盘 EC（示例）：同时把 command 改为 server /data{1...4} ---
      # - "/srv/minio/data1:/data1"
      # - "/srv/minio/data2:/data2"
      # - "/srv/minio/data3:/data3"
      # - "/srv/minio/data4:/data4"
    ports:
      - "9000:9000"   # S3 API (HTTP)
      - "9001:9001"   # Web Console (HTTP)
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/ready"]
      interval: 30s
      timeout: 5s
      retries: 5
    labels:
      # --- Traefik 占位（现在不会生效）---
      - "traefik.enable=true"
      - "traefik.http.routers.minio-api.rule=Host(${MINIO_API_DOMAIN})"
      - "traefik.http.routers.minio-api.entrypoints=websecure"
      - "traefik.http.routers.minio-api.tls.certresolver=le"
      - "traefik.http.services.minio-api.loadbalancer.server.port=9000"
      - "traefik.http.routers.minio-console.rule=Host(${MINIO_CONSOLE_DOMAIN})"
      - "traefik.http.routers.minio-console.entrypoints=websecure"
      - "traefik.http.routers.minio-console.tls.certresolver=le"
      - "traefik.http.services.minio-console.loadbalancer.server.port=9001"
```

---

## 步骤 4：（可选）开放端口

### UFW

```bash
sudo ufw allow 9000,9001/tcp
```

### firewalld

```bash
# sudo firewall-cmd --add-port=9000/tcp --add-port=9001/tcp --permanent
# sudo firewall-cmd --reload
```

---

## 步骤 5：启动与验证

```bash
docker compose up -d
docker compose ps

# 健康检查（200 为正常）
curl -I http://192.168.0.67:9000/minio/health/ready
```
- **控制台:** `http://192.168.0.67:9001` (登录：`admin / admin1234`)
- **S3 API:** `http://192.168.0.67:9000`

---

## 步骤 6：安装 `mc`（MinIO Client）

若在线下载慢，推荐浏览器下载后上传：

- **浏览器下载（x86_64）:** [https://dl.min.io/client/mc/release/linux-amd64/mc](https://dl.min.io/client/mc/release/linux-amd64/mc)

上传到服务器（举例）：

```bash
scp ~/Downloads/mc hq@192.168.0.67:/home/hq/
```

安装：

```bash
chmod +x /home/hq/mc
sudo mv /home/hq/mc /usr/local/bin/mc
mc --version
```

---

## 步骤 7：配置别名、创建桶、上传/下载

**要点：** `mc share` 的 URL 基于你设置的“别名 endpoint”。想让分享链接用 `192.168.0.67`，别名就必须指向 `http://192.168.0.67:9000`。

```bash
# 1) 设定别名（请用“对外可达”的地址）
mc alias set myminio http://192.168.0.67:9000 admin admin1234
mc alias list

# 2) 创建桶
mc mb myminio/test-bucket

# 3) 上传文件
echo "hello" > hello.txt
mc cp hello.txt myminio/test-bucket/

# 4) 查看
mc ls myminio/test-bucket

# 5) 生成临时下载链接（默认 7 天）
mc share download myminio/test-bucket/hello.txt
```
**需要公开读（测试用）:** `mc anonymous set download myminio/test-bucket`
**取消公开:** `mc anonymous set none myminio/test-bucket`

---

## 8. AWS CLI 作为备用（签名上传）

```bash
sudo apt-get install -y awscli

aws configure
# AWS Access Key ID: admin
# AWS Secret Access Key: admin1234
# Default region name: us-east-1
# Default output format: json

# 创建桶 / 上传 / 列目录（记得带 endpoint）
aws --endpoint-url http://192.168.0.67:9000 s3 mb s3://test-bucket
aws --endpoint-url http://192.168.0.67:9000 s3 cp hello.txt s3://test-bucket/
aws --endpoint-url http://192.168.0.67:9000 s3 ls s3://test-bucket/
```

---

## 步骤 9：切换到 HTTPS（Traefik + Let’s Encrypt）

### 准备解析记录：
- `s3.example.com` → 服务器公网/内网 IP
- `console.example.com` → 同上

### 修改 `.env`：
- 把 `MINIO_API_DOMAIN`/`MINIO_CONSOLE_DOMAIN`/`LETSENCRYPT_EMAIL` 改为真实值
- 把 `PUBLIC_API_ENDPOINT`/`PUBLIC_CONSOLE_ENDPOINT` 改为 `https://你的域名`

### 编辑 `docker-compose.yml`：
- **解注释** `traefik` 服务
- **移除** `minio` 服务的 `ports` 配置（MinIO 不再直连 `9000`/`9001`）

### 应用：
```bash
docker compose down
docker compose up -d
```
访问：
- `https://s3.example.com` (S3 API，经 Traefik)
- `https://console.example.com` (控制台)

**小建议：** 可以先用临时自签证书或内网 CA 验证 Traefik 流程，再切换 ACME。

---

## 常用维护

- **查看日志:** `docker logs -f minio`
- **升级镜像:**
  ```bash
  docker compose pull
  docker compose up -d
  ```
- **数据备份:**
  直接对宿主机目录 `/srv/minio/data` 做快照/备份；或用 `mc mirror` 同步到二级存储。
  ```bash
  mc mirror --overwrite myminio/test-bucket/ s3backup/test-bucket/
  ```

---

## FAQ

**Q1：`mc share` 生成的链接还是 `127.0.0.1`？**
**A：** `mc share` 只看你本地别名的 `endpoint`。执行：
```bash
mc alias list
mc alias set myminio http://192.168.0.67:9000 admin admin1234
```
然后再 `mc share download ...`。修改 `.env` 只影响 MinIO 自报地址（SDK 重定向等），不改变 `mc` 的别名。

**Q2：改 `.env` 或重启容器会丢桶/文件吗？**
**A：** 不会。您的数据挂载在宿主机 `/srv/minio/data`。`docker compose down && up -d` 不会删除数据。

**Q3：用 `curl -u admin:admin1234 PUT` 上传报错：`Please use AWS4-HMAC-SHA256`？**
**A：** S3 协议要求 V4 签名。请使用 `mc` 或 `aws s3`，不要使用 Basic Auth：
```bash
aws --endpoint-url http://192.168.0.67:9000 s3 cp hello.txt s3://test-bucket/
```

**Q4：`permission denied` / 普通用户无法运行 `docker`？**
**A：** 将用户加入 `docker` 组并重新登录：
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Q5：端口被占用（`9000`/`9001`）怎么办？**
**A：** 检查端口占用情况并调整 Compose 映射或释放端口：
```bash
sudo lsof -i :9000 -P -n
sudo lsof -i :9001 -P -n
```

**Q6：下载 `mc` 很慢？**
**A：** 优先浏览器下载后 `scp` 上传；或改用 AWS CLI 完成验证。
上传并安装示例：
```bash
scp ~/Downloads/mc hq@192.168.0.67:/home/hq/
ssh hq@192.168.0.67 "chmod +x /home/hq/mc && sudo mv /home/hq/mc /usr/local/bin/mc"
```

**Q7：内网其他机器访问失败？**
**A：** 确认三点：
1. 别名与 `.env` 中地址用的是服务器可达 IP/主机名，而不是 `127.0.0.1`；
2. 防火墙放行 `9000`/`9001` 端口；
3. 访问 URL 与签名 URL 的主机名/IP 一致。

**Q8：Traefik 启用后 `80`/`443` 正常，S3/控制台打不开？**
**A：** 别忘了去掉 `minio` 的 `ports` 直连，并使用域名访问；检查 Traefik 日志与证书获取是否成功。

**Q9：Healthcheck 一直失败？**
**A：** 检查容器日志、磁盘权限与挂载路径；本地自测：
```bash
docker exec -it minio sh -c 'curl -I http://localhost:9000/minio/health/ready'
```

**Q10：需要匿名公开下载一个桶做临时演示？**
**A：** 仅限测试场景：
```bash
mc anonymous set download myminio/test-bucket
# 恢复私有
mc anonymous set none myminio/test-bucket
```

---

## 附录：CentOS/RHEL 安装 Docker（可选）

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```
```