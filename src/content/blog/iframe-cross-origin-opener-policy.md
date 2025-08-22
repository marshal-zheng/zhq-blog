---
author: ZHQ
pubDatetime: 2025-06-05T10:45:00+09:20
title: 'iframe跨域与Cross-Origin-Opener-Policy问题解决'
featured: false
draft: false
tags:
  - 'frontend'
description: '记录常用iframe开发遇到的问题'
---
## 使用iframe嵌套第三方系统, 下载遇到如下问题

![屏蔽示意图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/3qbxPf.jpg)

![AI模型补全示意图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/7hadul.jpg)

如上图浏览器已经给出了相关响应头未知了, 如果使用的是nginx, 可以在nginx中配置如下:
```bash
proxy_hide_header Cross-Origin-Opener-Policy;
```

