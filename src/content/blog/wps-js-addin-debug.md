---
author: ZHQ
pubDatetime: 2025-06-05T19:45:00+08:00
title: '开发wps插件时如何调用调试器'
featured: false
draft: false
tags:
  - 'wpsjs'
description: '记录正确调用WPS js Addin Debug洁面'
---

在使用 WPS JS 开发 WPS 插件的过程中，有时需要在 WPS 中调试代码。在使用 `wpsjs create` 创建的示例中，顶部自定义功能区提供了一个“打开 JS 调试器”按钮。点击后会弹出类似浏览器的开发者调试工具。然而，实际使用时发现调试器仅显示 Ribbon 初始化的调试信息，后续添加的 `console` 输出或网络请求信息无法在调试器中查看。

![WPS JS Addin Debugger](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/w5VfPA.jpg)

经过一番操作后发现，在 macOS 或 Windows 系统上，可以通过按下 `Fn + F2` 组合键来调用开发者调试器。这样就可以正常查看 `console` 输出和网络请求信息，方便调试插件功能。如下图我在点击按钮的时候加了个mock接口调用, 使用快捷键调用调试器可以看到调用的接口:

![调用调试器后的效果](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/Q7Bfr6.jpg)
