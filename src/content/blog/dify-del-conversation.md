---
author: ZHQ
pubDatetime: 2025-08-07T12:30:00+08:00
title: 'dify 删除会话'
featured: false
draft: false
tags:
  - 'dify'
description: 'dify删除会话记录'
---

# 删除会话

删除指定的会话。

## Request

`DELETE /conversations/:conversation_id`

### Path Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `conversation_id` | string | 会话 ID。 |

### Request Body

| Name | Type | Description |
| :--- | :--- | :--- |
| `user` | string | 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。 |

## Response

成功时，服务器将返回 `204 No Content` 状态码，表示删除成功且响应体中无内容。

## Example

### Request

```bash
curl -X DELETE 'https://api.dify.ai/v1/conversations/4e815e8b-bda2-4a25-9923-a55e2f3d58d7' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "user": "abc-123"
}'
```
*(注意: 上述 URL 中的 `:conversation_id` 已被一个示例 ID 替换)*

### Response

```
HTTP/1.1 204 No Content
```