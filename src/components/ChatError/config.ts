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
  allowRetry: false, // 不显示重试按钮
  maxRetryCount: 0,
  enableReporting: false // 不显示报告问题
};

// 错误严重程度样式配置 - 更专业的企业级设计
export const severityConfig: Record<ErrorSeverity, {
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
}> = {
  info: {
    bgColor: 'bg-gray-50 dark:bg-gray-800/80',
    textColor: 'text-gray-700 dark:text-gray-200',
    borderColor: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-500 dark:text-gray-400'
  },
  warning: {
    bgColor: 'bg-amber-50/80 dark:bg-amber-900/20',
    textColor: 'text-amber-700 dark:text-amber-200',
    borderColor: 'border-amber-200 dark:border-amber-800/60',
    iconColor: 'text-amber-500 dark:text-amber-400'
  },
  error: {
    bgColor: 'bg-rose-50/80 dark:bg-rose-950/30',
    textColor: 'text-rose-700 dark:text-rose-200',
    borderColor: 'border-rose-200 dark:border-rose-800/50',
    iconColor: 'text-rose-500 dark:text-rose-400'
  },
  critical: {
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    textColor: 'text-red-700 dark:text-red-200',
    borderColor: 'border-red-200 dark:border-red-800/60',
    iconColor: 'text-red-500 dark:text-red-400'
  }
};

// 错误类别图标配置 - 使用 lucide-react 图标名称
export const categoryIcons: Record<ErrorCategory, string> = {
  network: 'WifiIcon',
  auth: 'LockIcon', 
  rate_limit: 'ClockIcon',
  server: 'ServerIcon',
  model: 'BrainIcon',
  validation: 'ShieldCheckIcon',
  timeout: 'AlertTriangleIcon',
  unknown: 'HelpCircleIcon'
};

// 错误友好提示配置
export const friendlyMessages: Record<ErrorCategory, {
  title: string;
  shortDescription: string;
}> = {
  network: {
    title: '网络连接问题',
    shortDescription: '无法连接到服务器'
  },
  auth: {
    title: '身份验证失败',
    shortDescription: 'API密钥或权限问题'
  },
  rate_limit: {
    title: '请求太频繁了',
    shortDescription: '请稍等一下再试'
  },
  server: {
    title: '服务器遇到问题',
    shortDescription: '我们正在努力修复'
  },
  model: {
    title: 'AI模型不可用',
    shortDescription: '请尝试其他模型'
  },
  validation: {
    title: '输入内容有问题',
    shortDescription: '请检查您的输入'
  },
  timeout: {
    title: '响应超时了',
    shortDescription: '服务器响应时间过长'
  },
  unknown: {
    title: '出现了未知问题',
    shortDescription: '请尝试重新操作'
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
