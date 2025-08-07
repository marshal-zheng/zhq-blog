---
author: ZHQ
pubDatetime: 2025-08-07T12:13:00+08:00
title: 'dify chat messages接口文档'
featured: false
draft: false
tags:
  - 'dify'
description: 'dify chat-messages文档记录'
---


# 发送对话消息

## Request Body

| Name | Type | Description |
| :--- | :--- | :--- |
| `query` | string | 用户输入/提问内容。 |
| `inputs` | object | 允许传入 App 定义的各变量值。 inputs 参数包含了多组键值对（Key/Value pairs），每组的键对应一个特定变量，每组的值则是该变量的具体值。 如果变量是文件类型，请指定一个包含以下 files 中所述键的对象。 默认 `{}` |
| `response_mode` | string | `streaming` 流式模式（推荐）。基于 SSE（Server-Sent Events）实现类似打字机输出方式的流式返回。<br>`blocking` 阻塞模式，等待执行完毕后返回结果。（请求若流程较长可能会被中断）。 由于 Cloudflare 限制，请求会在 100 秒超时无返回后中断。 |
| `user` | string | 用户标识，用于定义终端用户的身份，方便检索、统计。 由开发者定义规则，需保证用户标识在应用内唯一。服务 API 不会共享 WebApp 创建的对话。 |
| `conversation_id` | string | （选填）会话 ID，需要基于之前的聊天记录继续对话，必须传之前消息的 `conversation_id`。 |
| `files` | array[object] | 文件列表，适用于传入文件结合文本理解并回答问题，仅当模型支持 Vision 能力时可用。<br><br>**`type`** (string) 支持类型：<br>  - `document` 具体类型包含：`'TXT'`, `'MD'`, `'MARKDOWN'`, `'PDF'`, `'HTML'`, `'XLSX'`, `'XLS'`, `'DOCX'`, `'CSV'`, `'EML'`, `'MSG'`, `'PPTX'`, `'PPT'`, `'XML'`, `'EPUB'`<br>  - `image` 具体类型包含：`'JPG'`, `'JPEG'`, `'PNG'`, `'GIF'`, `'WEBP'`, `'SVG'`<br>  - `audio` 具体类型包含：`'MP3'`, `'M4A'`, `'WAV'`, `'WEBM'`, `'AMR'`<br>  - `video` 具体类型包含：`'MP4'`, `'MOV'`, `'MPEG'`, `'MPGA'`<br>  - `custom` 具体类型包含：其他文件类型<br>**`transfer_method`** (string) 传递方式:<br>  - `remote_url`: 图片地址。<br>  - `local_file`: 上传文件。<br>**`url`** 图片地址。（仅当传递方式为 `remote_url` 时）。<br>**`upload_file_id`** 上传文件 ID。（仅当传递方式为 `local_file` 时）。|
| `auto_generate_name` | bool | （选填）自动生成标题，默认 `true`。 若设置为 `false`，则可通过调用会话重命名接口并设置 `auto_generate` 为 `true` 实现异步生成标题。 |
| `trace_id` | string | （选填）链路追踪ID。适用于与业务系统已有的trace组件打通，实现端到端分布式追踪等场景。如果未指定，系统会自动生成trace_id。支持以下三种方式传递，具体优先级依次为：<br>1. Header：通过 HTTP Header `X-Trace-Id` 传递，优先级最高。<br>2. Query 参数：通过 URL 查询参数 `trace_id` 传递。<br>3. Request Body：通过请求体字段 `trace_id` 传递（即本字段）。 |

## Response

当 `response_mode` 为 `blocking` 时，返回 `ChatCompletionResponse` object。 当 `response_mode` 为 `streaming`时，返回 `ChunkChatCompletionResponse` object 流式序列。

---

#### ChatCompletionResponse
返回完整的 App 结果，`Content-Type` 为 `application/json`。

| Name | Type | Description |
| :--- | :--- | :--- |
| `event` | string | 事件类型，固定为 `message` |
| `task_id` | string | 任务 ID，用于请求跟踪和下方的停止响应接口 |
| `id` | string | 唯一ID |
| `message_id` | string | 消息唯一 ID |
| `conversation_id` | string | 会话 ID |
| `mode` | string | App 模式，固定为 `chat` |
| `answer` | string | 完整回复内容 |
| `metadata` | object | 元数据，包含以下字段：<br>- **`usage`** (Usage): 模型用量信息<br>- **`retriever_resources`** (array[RetrieverResource]): 引用和归属分段列表 |
| `created_at` | int | 消息创建时间戳，如：`1705395332` |

#### ChunkChatCompletionResponse
返回 App 输出的流式块，`Content-Type` 为 `text/event-stream`。 每个流式块均为 `data:` 开头，块之间以 `\n\n` 即两个换行符分隔，如下所示：

```text
data: {"event": "message", "task_id": "900bbd43-dc0b-4383-a372-aa6e6c414227", "id": "663c5084-a254-4040-8ad3-51f2a3c1a77c", "answer": "Hi", "created_at": 1705398420}\n\n
```

流式块中根据 `event` 不同，结构也不同：

*   **`event: message`**
    LLM 返回文本块事件，即：完整的文本以分块的方式输出。

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID，用于请求跟踪和下方的停止响应接口 |
    | `message_id` | string | 消息唯一 ID |
    | `conversation_id` | string | 会话 ID |
    | `answer` | string | LLM 返回文本块内容 |
    | `created_at` | int | 创建时间戳，如：`1705395332` |

*   **`event: message_file`**
    文件事件，表示有新文件需要展示

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `id` | string | 文件唯一ID |
    | `type` | string | 文件类型，目前仅为`image` |
    | `belongs_to` | string | 文件归属，`user`或`assistant`，该接口返回仅为 `assistant` |
    | `url` | string | 文件访问地址 |
    | `conversation_id` | string | 会话ID |

*   **`event: message_end`**
    消息结束事件，收到此事件则代表流式返回结束。

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID，用于请求跟踪和下方的停止响应接口 |
    | `message_id` | string | 消息唯一 ID |
    | `conversation_id` | string | 会话 ID |
    | `metadata` | object | 元数据，包含以下字段：<br>- **`usage`** (Usage): 模型用量信息<br>- **`retriever_resources`** (array[RetrieverResource]): 引用和归属分段列表 |

*   **`event: tts_message`**
    TTS 音频流事件，即：语音合成输出。内容是Mp3格式的音频块，使用 base64 编码后的字符串，播放的时候直接解码即可。(开启自动播放才有此消息)

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `message_id` | string | 消息唯一 ID |
    | `audio` | string | 语音合成之后的音频块使用 Base64 编码之后的文本内容 |
    | `created_at` | int | 创建时间戳 |

*   **`event: tts_message_end`**
    TTS 音频流结束事件，收到这个事件表示音频流返回结束。

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `message_id` | string | 消息唯一 ID |
    | `audio` | string | 结束事件是没有音频的，所以这里是空字符串 |
    | `created_at` | int | 创建时间戳 |

*   **`event: message_replace`**
    消息内容替换事件。 开启内容审查和审查输出内容时，若命中了审查条件，则会通过此事件替换消息内容为预设回复。
    
    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `message_id` | string | 消息唯一 ID |
    | `conversation_id` | string | 会话 ID |
    | `answer` | string | 替换内容（直接替换 LLM 所有回复文本） |
    | `created_at` | int | 创建时间戳 |

*   **`event: workflow_started`**
    workflow 开始执行

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `workflow_run_id` | string | workflow 执行 ID |
    | `event` | string | 固定为 `workflow_started` |
    | `data` | object | 详细内容 (`id`, `workflow_id`, `created_at`) |

*   **`event: node_started`**
    node 开始执行
    
    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `workflow_run_id` | string | workflow 执行 ID |
    | `event` | string | 固定为 `node_started` |
    | `data` | object | 详细内容 (`id`, `node_id`, `node_type`, `title`, etc.) |

*   **`event: node_finished`**
    node 执行结束，成功失败同一事件中不同状态

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `workflow_run_id` | string | workflow 执行 ID |
    | `event` | string | 固定为 `node_finished` |
    | `data` | object | 详细内容 (`id`, `node_id`, `status`, `outputs`, etc.) |

*   **`event: workflow_finished`**
    workflow 执行结束，成功失败同一事件中不同状态

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `workflow_run_id` | string | workflow 执行 ID |
    | `event` | string | 固定为 `workflow_finished` |
    | `data` | object | 详细内容 (`id`, `workflow_id`, `status`, `outputs`, etc.) |

*   **`event: error`**
    流式输出过程中出现的异常会以 stream event 形式输出，收到异常事件后即结束。

    | Name | Type | Description |
    | :--- | :--- | :--- |
    | `task_id` | string | 任务 ID |
    | `message_id` | string | 消息唯一 ID |
    | `status` | int | HTTP 状态码 |
    | `code` | string | 错误码 |
    | `message` | string | 错误消息 |

*   **`event: ping`**
    每 10s 一次的 ping 事件，保持连接存活。

## Errors

*   `404`，对话不存在
*   `400`，`invalid_param`，传入参数异常
*   `400`，`app_unavailable`，App 配置不可用
*   `400`，`provider_not_initialize`，无可用模型凭据配置
*   `400`，`provider_quota_exceeded`，模型调用额度不足
*   `400`，`model_currently_not_support`，当前模型不可用
*   `400`，`completion_request_error`，文本生成失败
*   `500`，服务内部异常

## Request

`POST /chat-messages`

```bash
curl -X POST 'https://api.dify.ai/v1/chat-messages' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "inputs": {},
    "query": "What are the specs of the iPhone 13 Pro Max?",
    "response_mode": "streaming",
    "conversation_id": "",
    "user": "abc-123",
    "files": [
      {
        "type": "image",
        "transfer_method": "remote_url",
        "url": "https://cloud.dify.ai/logo/logo-site.png"
      }
    ]
}'
```

### 阻塞模式 Response

```json
{
    "event": "message",
    "task_id": "c3800678-a077-43df-a102-53f23ed20b88", 
    "id": "9da23599-e713-473b-982c-4328d4f5c78a",
    "message_id": "9da23599-e713-473b-982c-4328d4f5c78a",
    "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2",
    "mode": "chat",
    "answer": "iPhone 13 Pro Max specs are listed here:...",
    "metadata": {
        "usage": {
            "prompt_tokens": 1033,
            "prompt_unit_price": "0.001",
            "prompt_price_unit": "0.001",
            "prompt_price": "0.0010330",
            "completion_tokens": 128,
            "completion_unit_price": "0.002",
            "completion_price_unit": "0.001",
            "completion_price": "0.0002560",
            "total_tokens": 1161,
            "total_price": "0.0012890",
            "currency": "USD",
            "latency": 0.7682376249867957
        },
        "retriever_resources": [
            {
                "position": 1,
                "dataset_id": "101b4c97-fc2e-463c-90b1-5261a4cdcafb",
                "dataset_name": "iPhone",
                "document_id": "8dd1ad74-0b5f-4175-b735-7d98bbbb4e00",
                "document_name": "iPhone List",
                "segment_id": "ed599c7f-2766-4294-9d1d-e5235a61270a",
                "score": 0.98457545,
                "content": "\"Model\",\"Release Date\",\"Display Size\",\"Resolution\",\"Processor\",\"RAM\",\"Storage\",\"Camera\",\"Battery\",\"Operating System\"\n\"iPhone 13 Pro Max\",\"September 24, 2021\",\"6.7 inch\",\"1284 x 2778\",\"Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)\",\"6 GB\",\"128, 256, 512 GB, 1TB\",\"12 MP\",\"4352 mAh\",\"iOS 15\""
            }
        ]
    },
    "created_at": 1705407629
}
```

### 流式模式 Response

```text
data: {"event": "workflow_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "created_at": 1679586595}}
data: {"event": "node_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "created_at": 1679586595}}
data: {"event": "node_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "execution_metadata": {"total_tokens": 63127864, "total_price": 2.378, "currency": "USD"},  "created_at": 1679586595}}
data: {"event": "workflow_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "total_tokens": 63127864, "total_steps": "1", "created_at": 1679586595, "finished_at": 1679976595}}
data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " I", "created_at": 1679586595}
data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": "'m", "created_at": 1679586595}
data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " glad", "created_at": 1679586595}
data: {"event": "message", "message_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " to", "created_at": 1679586595}
data: {"event": "message", "message_id" : "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " meet", "created_at": 1679586595}
data: {"event": "message", "message_id" : "5ad4cb98-f0c7-4085-b384-88c403be6290", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "answer": " you", "created_at": 1679586595}
data: {"event": "message_end", "id": "5e52ce04-874b-4d27-9045-b3bc80def685", "conversation_id": "45701982-8118-4bc5-8e9b-64562b4555f2", "metadata": {"usage": {"prompt_tokens": 1033, "prompt_unit_price": "0.001", "prompt_price_unit": "0.001", "prompt_price": "0.0010330", "completion_tokens": 135, "completion_unit_price": "0.002", "completion_price_unit": "0.001", "completion_price": "0.0002700", "total_tokens": 1168, "total_price": "0.0013030", "currency": "USD", "latency": 1.381760165997548}, "retriever_resources": [{"position": 1, "dataset_id": "101b4c97-fc2e-463c-90b1-5261a4cdcafb", "dataset_name": "iPhone", "document_id": "8dd1ad74-0b5f-4175-b735-7d98bbbb4e00", "document_name": "iPhone List", "segment_id": "ed599c7f-2766-4294-9d1d-e5235a61270a", "score": 0.98457545, "content": "\"Model\",\"Release Date\",\"Display Size\",\"Resolution\",\"Processor\",\"RAM\",\"Storage\",\"Camera\",\"Battery\",\"Operating System\"\n\"iPhone 13 Pro Max\",\"September 24, 2021\",\"6.7 inch\",\"1284 x 2778\",\"Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)\",\"6 GB\",\"128, 256, 512 GB, 1TB\",\"12 MP\",\"4352 mAh\",\"iOS 15\""}]}}
data: {"event": "tts_message", "conversation_id": "23dd85f3-1a41-4ea0-b7a9-062734ccfaf9", "message_id": "a8bdc41c-13b2-4c18-bfd9-054b9803038c", "created_at": 1721205487, "task_id": "3bf8a0bb-e73b-4690-9e66-4e429bad8ee7", "audio": "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"}
data: {"event": "tts_message_end", "conversation_id": "23dd85f3-1a41-4ea0-b7a9-062734ccfaf9", "message_id": "a8bdc41c-13b2-4c18-bfd9-054b9803038c", "created_at": 1721205487, "task_id": "3bf8a0bb-e73b-4690-9e66-4e429bad8ee7", "audio": ""}
```