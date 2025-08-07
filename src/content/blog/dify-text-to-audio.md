---
author: ZHQ
pubDatetime: 2025-08-07T12:34:00+08:00
title: 'dify 文字转语音'
featured: false
draft: false
tags:
  - 'dify'
description: 'dify文字转语音接口记录'
---

好的，这是您提供的“文字转语音” API 的 Markdown 格式文档。

这是一个很有趣的 API，因为它的响应不是常见的 JSON，而是直接返回音频文件的二进制数据流。在文档中清晰地说明这一点非常重要。

---

# 文字转语音 (Text-to-Speech)

将文本内容转换为语音文件。

## Request

`POST /text-to-audio`

### Request Body

| Name | Type | Description |
| :--- | :--- | :--- |
| `message_id` | string | Dify 生成的消息 ID。如果提供此 ID，API 会查找对应的消息内容进行语音合成。**此参数优先于 `text`**。 |
| `text` | string | 需要转换为语音的文本内容。如果未提供 `message_id`，则使用此字段的内容。 |
| `user` | string | 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。 |

## Response

### Response Body

成功时，服务器将直接返回音频文件的**二进制流**。客户端需要根据 `Content-Type` 响应头来处理此数据（例如，直接保存为音频文件）。

### Response Headers

| Header | Value |
| :--- | :--- |
| `Content-Type` | `audio/wav` (或其他音频格式，如 `audio/mpeg` for mp3) |

## Example

### Request

下面的 `curl` 示例使用 `-o` 参数将服务器返回的音频流直接保存为名为 `text-to-audio.mp3` 的文件。

```bash
curl -o text-to-audio.mp3 -X POST 'https://api.dify.ai/v1/text-to-audio' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290",
    "text": "你好Dify",
    "user": "abc-123"
}'
```

### Response

执行上述命令后，会在当前目录下生成一个名为 `text-to-audio.mp3` 的音频文件。