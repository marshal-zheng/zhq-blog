---
author: ZHQ
pubDatetime: 2025-08-07T12:21:00+08:00
title: 'dify 获取历史消息'
featured: false
draft: false
tags:
  - 'dify'
description: 'dify获取历史消息记录'
---


# 获取会话历史消息

滚动加载形式返回历史聊天记录，第一页返回最新 `limit` 条，即：倒序返回。

## Request

`GET /messages`

**注：** 实际的 URL 路径可能为 `GET /conversations/{conversation_id}/messages`，其中 `conversation_id` 是路径参数，其余为查询参数。请根据您的具体实现进行调整。

### Path Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `conversation_id` | string | 会话 ID |

### Query Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `user` | string | 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。 |
| `first_id` | string | 当前页第一条聊天记录的 ID，用于分页。第一次请求时留空。 |
| `limit` | int | 一次请求返回多少条聊天记录，默认 `20` 条。 |

## Response

成功时，返回一个 JSON 对象，包含以下字段：

| Name | Type | Description |
| :--- | :--- | :--- |
| `data` | array[object] | 消息对象列表。数组中的每个对象结构见下表。 |
| `has_more` | bool | 是否存在下一页（更早的历史记录）。 |
| `limit` | int | 实际返回的条数。若传入的 `limit` 超过系统限制，将返回系统限制的最大数量。 |

### `data` 数组对象结构

数组中的每个对象代表一条历史消息，其结构如下：

| Name | Type | Description |
| :--- | :--- | :--- |
| `id` | string | 消息 ID。 |
| `conversation_id` | string | 该消息所属的会话 ID。 |
| `inputs` | object | 用户输入参数。 |
| `query` | string | 用户输入 / 提问内容。 |
| `message_files` | array[object] | 消息中包含的文件列表，每个文件对象包含：<br>- `id` (string): 文件 ID<br>- `type` (string): 文件类型, e.g., `image`<br>- `url` (string): 预览图片地址<br>- `belongs_to` (string): 文件归属方, `user` 或 `assistant` |
| `answer` | string | 回答消息内容。 |
| `created_at` | timestamp | 消息创建时间戳。 |
| `feedback` | object | 用户对该消息的反馈信息，包含：<br>- `rating` (string): 点赞 `like` / 点踩 `dislike` |
| `retriever_resources`| array[RetrieverResource] | 引用和归属分段列表。 |