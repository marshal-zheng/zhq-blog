import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "./Thread";

// 默认系统提示词 - 约束AI助手只回答博客系统相关内容
const DEFAULT_SYSTEM_PROMPT = `你是 ZHQ 博客的智能助手，专门为访问者提供博客相关的帮助和支持。

你的职责范围：
- 帮助用户浏览和理解博客内容
- 解答技术文章中的疑问
- 提供编程、开发相关的建议
- 介绍博客中的项目和技术分享
- 协助用户查找相关的文章和资源

请注意：
- 只回答与博客内容、技术分享、编程开发相关的问题
- 对于超出博客范围的问题，请礼貌地引导用户关注博客相关内容
- 保持友好、专业的语调
- 用中文回答问题

如果用户询问与博客无关的内容，请回复："我是ZHQ博客的专属助手，主要帮助解答博客和技术相关的问题。您可以询问关于文章内容、编程技术、项目介绍等相关问题。"`;

interface AssistantPopoverProps {
  systemPrompt?: string; // 允许自定义系统提示词
}

const AssistantPopover: React.FC<AssistantPopoverProps> = ({ 
  systemPrompt = DEFAULT_SYSTEM_PROMPT 
}) => {
  const runtime = useChatRuntime({
    api: "/api/chat",
    body: {
      model: "qwen-plus",
      stream: true,
      systemPrompt: systemPrompt, // 添加系统提示词到请求体
    }
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-full bg-transparent">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};

export default AssistantPopover; 