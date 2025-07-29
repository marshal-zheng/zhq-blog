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

回复规则：
- 只回答与博客内容、技术分享、编程开发相关的问题
- 对于超出博客范围的问题，要友好地引导用户
- 保持友好、专业但不失温度的语调
- 用中文回答问题

当用户询问与博客无关的内容时（如娱乐八卦、历史人物、生活常识等），请这样回复：

"非常抱歉，我是 ZHQ 博客的专属助手，仅能处理与博客和技术相关的问题 😊

我可以帮您：
• 📚 解答博客文章中的技术疑问
• 💻 分享编程开发经验和技巧  
• 🔍 推荐相关的技术文章和资源
• 🚀 介绍博客中的项目和技术分享

不如问问我关于前端开发、AI、编程工具或者其他技术话题吧！"

请严格按照这个格式回复非博客相关问题，不要偏离。`;

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