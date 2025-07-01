import type { ErrorDetails, ErrorConfig } from './types';

// 类型定义
export type {
  ErrorSeverity,
  ErrorCategory,
  ErrorDetails,
  ErrorConfig,
  ErrorHandler,
  ActionSuggestion
} from './types';

// 核心组件
export { ChatError } from './ChatError';
export { SimpleChatError, AssistantUiChatError, parseErrorFromJson } from './SimpleChatError';
export { globalErrorHandler } from './hooks';

// 错误处理器
export {
  NetworkErrorHandler,
  NotFoundErrorHandler,
  AuthErrorHandler,
  RateLimitErrorHandler,
  ServerErrorHandler,
  TimeoutErrorHandler,
  DefaultErrorHandler,
  ErrorHandlerRegistry,
  errorHandlerRegistry
} from './handlers';

// 配置
export {
  defaultErrorConfig,
  severityConfig,
  categoryIcons,
  friendlyMessages,
  environmentConfig,
  getCurrentEnvironmentConfig
} from './config';

// 便捷创建函数
export const createCustomErrorHandler = (
  canHandle: (error: unknown) => boolean,
  handle: (error: unknown) => ErrorDetails
) => ({
  canHandle,
  handle
});

// 快速配置预设
export const errorConfigPresets = {
  // 开发环境 - 显示所有详情
  development: {
    showTechnicalDetails: true,
    showTimestamp: true,
    enableReporting: false,
    allowRetry: true,
    maxRetryCount: 5
  } satisfies Partial<ErrorConfig>,
  
  // 生产环境 - 简洁友好
  production: {
    showTechnicalDetails: false,
    showTimestamp: false,
    enableReporting: true,
    allowRetry: true,
    maxRetryCount: 3
  } satisfies Partial<ErrorConfig>,
  
  // 紧凑模式 - 最小化显示
  compact: {
    compact: true,
    showTechnicalDetails: false,
    showTimestamp: false,
    enableReporting: false,
    allowRetry: true,
    maxRetryCount: 1
  } satisfies Partial<ErrorConfig>,
  
  // 调试模式 - 最大化信息
  debug: {
    showTechnicalDetails: true,
    showTimestamp: true,
    enableReporting: true,
    allowRetry: true,
    maxRetryCount: 10,
    autoHideDelay: undefined
  } satisfies Partial<ErrorConfig>
};
