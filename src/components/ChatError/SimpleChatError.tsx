import type { FC } from 'react';
import type { ErrorConfig } from './types';
import { errorHandlerRegistry } from './handlers';
import { ChatError } from './ChatError';

export interface SimpleChatErrorProps {
  error: unknown;
  config?: Partial<ErrorConfig>;
  onRetry?: () => void;
  onClose?: () => void;
}

/**
 * 简化的聊天错误组件
 * 自动解析错误并显示友好的错误信息
 */
export const SimpleChatError: FC<SimpleChatErrorProps> = ({
  error,
  config,
  onRetry,
  onClose
}) => {
  // 使用错误处理器注册表处理错误
  const errorDetails = errorHandlerRegistry.handle(error);
  
  return (
    <ChatError
      error={errorDetails}
      config={config}
      onRetry={onRetry}
      onClose={onClose}
    />
  );
};

/**
 * 从JSON字符串解析错误的便捷函数
 */
export const parseErrorFromJson = (errorJson: string): unknown => {
  try {
    const parsed = JSON.parse(errorJson);
    
    // 如果是我们的错误格式，直接返回
    if (parsed.errorDetails) {
      return parsed;
    }
    
    // 否则创建一个错误对象
    return new Error(parsed.error || parsed.message || errorJson);
  } catch {
    // 解析失败，作为普通错误处理
    return new Error(errorJson);
  }
};

/**
 * 用于解析assistant-ui错误消息的组件
 */
export const AssistantUiChatError: FC<{
  message: string;
  config?: Partial<ErrorConfig>;
  onRetry?: () => void;
}> = ({ message, config, onRetry }) => {
  const error = parseErrorFromJson(message);
  
  return (
    <SimpleChatError
      error={error}
      config={config}
      onRetry={onRetry}
    />
  );
};
