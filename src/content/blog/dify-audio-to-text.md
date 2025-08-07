---
author: ZHQ
pubDatetime: 2025-08-07T12:27:00+08:00
title: 'dify 语音转文字'
featured: false
draft: false
tags:
  - 'dify'
description: 'dify语音转文字接口记录'
---

# 语音转文字 (Audio-to-Text)

将语音文件转换为文字。

## Request

`POST /audio-to-text`

### Request Body

该接口需使用 `multipart/form-data` 进行请求。

| Name | Type | Description |
| :--- | :--- | :--- |
| `file` | file | 语音文件。<br>**支持格式**：`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`<br>**文件大小限制**：15MB |
| `user` | string | 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。 |

## Response

成功时，服务器将返回一个包含转录文本的 JSON 对象。

| Name | Type | Description |
| :--- | :--- | :--- |
| `text` | string | 输出文字。 |

## Example

### Request

```bash
curl -X POST 'https://api.dify.ai/v1/audio-to-text' \
--header 'Authorization: Bearer {api_key}' \
--form 'file=@/path/to/your/audio.mp3' \
--form 'user=abc-123'
```
*(注意: 上述命令中的 `/path/to/your/audio.mp3` 应替换为您的本地语音文件路径)*

### Response

```json
{
  "text": "hello"
}
```