import type { ErrorConfig, ErrorSeverity, ErrorCategory } from './types';

// 默认配置
export const defaultErrorConfig: ErrorConfig = {
  // 显示设置
  showTechnicalDetails: false,
  showTimestamp: false,
  autoHideDelay: undefined, // 不自动隐藏
  
  // 主题设置
  theme: 'auto',
  compact: false,
  
  // 行为设置
  allowRetry: true,
  maxRetryCount: 3,
  enableReporting: true
};

// 错误严重程度样式配置
export const severityConfig: Record<ErrorSeverity, {
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
}> = {
  info: {
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    textColor: 'text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  warning: {
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  error: {
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    textColor: 'text-red-800 dark:text-red-200',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400'
  },
  critical: {
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-900 dark:text-red-100',
    borderColor: 'border-red-300 dark:border-red-700',
    iconColor: 'text-red-700 dark:text-red-300'
  }
};

// 错误类别图标配置
export const categoryIcons: Record<ErrorCategory, string> = {
  network: '🌐',
  auth: '🔐',
  rate_limit: '⏱️',
  server: '🖥️',
  model: '🤖',
  validation: '✏️',
  timeout: '⏰',
  unknown: '❓'
};

// 错误友好提示配置
export const friendlyMessages: Record<ErrorCategory, {
  title: string;
  shortDescription: string;
  emoji: string;
}> = {
  network: {
    title: '网络连接问题',
    shortDescription: '无法连接到服务器',
    emoji: '📡'
  },
  auth: {
    title: '身份验证失败',
    shortDescription: 'API密钥或权限问题',
    emoji: '🔑'
  },
  rate_limit: {
    title: '请求太频繁了',
    shortDescription: '请稍等一下再试',
    emoji: '🚦'
  },
  server: {
    title: '服务器遇到问题',
    shortDescription: '我们正在努力修复',
    emoji: '⚠️'
  },
  model: {
    title: 'AI模型不可用',
    shortDescription: '请尝试其他模型',
    emoji: '🤖'
  },
  validation: {
    title: '输入内容有问题',
    shortDescription: '请检查您的输入',
    emoji: '📝'
  },
  timeout: {
    title: '响应超时了',
    shortDescription: '服务器响应时间过长',
    emoji: '⏰'
  },
  unknown: {
    title: '出现了未知问题',
    shortDescription: '请尝试重新操作',
    emoji: '🤔'
  }
};

// 环境配置
export const environmentConfig = {
  development: {
    showTechnicalDetails: true,
    showTimestamp: true,
    enableReporting: false
  },
  production: {
    showTechnicalDetails: false,
    showTimestamp: false,
    enableReporting: true
  }
};

// 获取当前环境配置
export const getCurrentEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? environmentConfig.development : environmentConfig.production;
};
