---
author: ZHQ
pubDatetime: 2025-08-07T12:20:00+08:00
title: 'dify 应用上传文件接口'
featured: false
draft: false
tags:
  - 'dify'
description: 'dify上传文件接口记录'
---

# 上传文件

上传文件并在发送消息时使用，可实现图文多模态理解。 支持您的应用程序所支持的所有格式。 上传的文件仅供当前终端用户使用。

## Request Body
该接口需使用 `multipart/form-data` 进行请求。

| Name | Type | Description |
| :--- | :--- | :--- |
| `file` | file | 要上传的文件。 |
| `user` | string | 用户标识，用于定义终端用户的身份，必须和发送消息接口传入 `user` 保持一致。 |

## Response
成功上传后，服务器会返回文件的 ID 和相关信息。

| Name | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | ID |
| `name` | string | 文件名 |
| `size` | int | 文件大小（byte） |
| `extension` | string | 文件后缀 |
| `mime_type` | string | 文件 mime-type |
| `created_by` | uuid | 上传人 ID |
| `created_at` | timestamp | 上传时间 |

## Errors

*   `400`，`no_file_uploaded`，必须提供文件
*   `400`，`too_many_files`，目前只接受一个文件
*   `400`，`unsupported_preview`，该文件不支持预览
*   `400`，`unsupported_estimate`，该文件不支持估算
*   `413`，`file_too_large`，文件太大
*   `415`，`unsupported_file_type`，不支持的扩展名，当前只接受文档类文件
*   `503`，`s3_connection_failed`，无法连接到 S3 服务
*   `503`，`s3_permission_denied`，无权限上传文件到 S3
*   `503`，`s3_file_too_large`，文件超出 S3 大小限制

## Request

`POST /files/upload`

```bash
curl -X POST 'https://api.dify.ai/v1/files/upload' \
--header 'Authorization: Bearer {api_key}' \
--form 'file=@localfile;type=image/[png|jpeg|jpg|webp|gif]' \
--form 'user=abc-123'
```

## Response

```json
{
  "id": "72fa9618-8f89-4a37-9b33-7e1178a24a67",
  "name": "example.png",
  "size": 1024,
  "extension": "png",
  "mime_type": "image/png",
  "created_by": 123,
  "created_at": 1577836800
}
```