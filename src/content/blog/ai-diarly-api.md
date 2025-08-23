---
author: ZHQ
pubDatetime: 2025-08-05T10:45:00+08:00
title: 'AI领域常用接口'
featured: false
draft: false
tags:
  - 'ai'
description: '日常AI常用接口记录'
---

## 获取模型提供商支持的模型列表

不同的AI模型提供商通常会提供接口用于查询其支持的模型列表。以下是一个通用的示例：

```bash
curl https://api.<provider-domain>/v1/models
```

>请将 `<provider-domain>` 替换为实际的模型服务商域名，例如 `moonshot.cn`、`openai.com` 等。

