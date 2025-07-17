---
author: ZHQ
pubDatetime: 2025-07-17T00:00:00.000+08:00
title: '修复model provider doesnt serve your region'
featured: false
tags:
  - 'cursor'
description: '修复使用cursorr时报'
---

今天在使用 Cursor 时，发现由于地区限制无法使用 AI 功能。如下图:
![fix-cursor](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/7A7Nll.jpg)
经过咨询网友，了解到可以通过开启全局代理来解决，开启全局担心 VPN 流量不可控, 这里给一个 IDE 的 User Settings 配置的方式, 在此记录:

1. 按下 Ctrl/Cmd + Shift + P 打开命令面板。
2. 输入并选择 `Preferences: Open Settings (JSON)`（注意不要选择 “Open Default Settings (JSON)”）。
3. 在打开的 User Settings 文件中，粘贴并调整如下代理配置：

  ```json
  { 
  "http.proxy": "http://127.0.0.1:33210",
  "http.proxyStrictSSL": false,
  "http.proxySupport": "on",
}
  ```
> <span class="text-red-500">注意: 33210换成你的代理端口</span>

4. 保存设置后，重启 IDE 即可生效。
