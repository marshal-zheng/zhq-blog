---
author: ZHQ
pubDatetime: 2023-07-8T10:54:00Z
title: 'Python日常开发常用命令'
featured: false
draft: false
tags:
  - Python
  - '高效开发'
description: '记录日常开发中python常用。'
---

#### 创建虚拟环境
```bash
python -m venv venv
```

#### 激活虚拟环境
```bash
source venv/bin/activate
```

#### 退出虚拟环境
```bash
deactivate
```

#### 安装包
```bash
pip install package_name
```

#### 查看已安装的包
```bash
pip list
```

#### 升级 pip
```bash
python -m pip install --upgrade pip
```

#### 安装指定版本的包
```bash
pip install package_name==version
```

#### 卸载包
```bash
pip uninstall package_name
```

#### 导出已安装包的依赖列表
```bash
pip freeze > requirements.txt
```

#### 从依赖列表安装包
```bash
pip install -r requirements.txt
```
#### 查看是否安装了某个依赖包
```bash
python -c "import sentence_transformers; print('已安装 sentence-transformers')"
```