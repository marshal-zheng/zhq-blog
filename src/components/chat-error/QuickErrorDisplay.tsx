import type { FC } from "react";
import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, RefreshCw, WifiOff, Clock } from 'lucide-react';
import { errorConfigPresets } from './index';

// 识别错误类型的正则表达式
const ERROR_PATTERNS = {
  network: /(network|connection|fetch|conn|refused|unreachable)/i,
  notFound: /(404|not\s*found|no\s*model|unknown\s*model)/i,
  timeout: /(timeout|timed\s*out|too\s*long)/i,
  server: /(500|server\s*error|internal\s*error)/i,
  auth: /(401|403|unauthorized|forbidden|permission|denied)/i,
  rateLimit: /(429|rate\s*limit|too\s*many\s*requests|quota)/i
};

// 错误类型配置
const ERROR_TYPES = {
  network: {
    icon: WifiOff,
    title: '网络连接失败',
    description: '无法连接到服务器，请检查您的网络连接后重试。',
    emoji: '🌐',
    suggestions: [
      '检查网络连接是否正常',
      '确认服务器是否可访问',
      '稍后再试'
    ]
  },
  notFound: {
    icon: AlertTriangle,
    title: '模型不可用',
    description: '当前选择的AI模型暂时不可用，请尝试选择其他模型或稍后重试。',
    emoji: '🤖',
    suggestions: [
      '检查模型名称是否正确',
      '选择其他可用模型',
      '联系管理员确认服务状态'
    ]
  },
  timeout: {
    icon: Clock,
    title: '请求超时',
    description: '服务器响应时间过长，请稍后重试或缩短消息长度。',
    emoji: '⏰',
    suggestions: [
      '稍后重试',
      '缩短消息长度',
      '分多次发送长消息'
    ]
  },
  server: {
    icon: AlertTriangle,
    title: '服务器错误',
    description: '服务器遇到了内部错误，我们正在努力修复。请稍后重试。',
    emoji: '🖥️',
    suggestions: [
      '稍后重试',
      '联系管理员确认服务状态',
      '检查服务器日志'
    ]
  },
  auth: {
    icon: AlertTriangle,
    title: '身份验证失败',
    description: 'API密钥无效或已过期，请检查您的认证信息。',
    emoji: '🔑',
    suggestions: [
      '检查API密钥是否正确',
      '确认API密钥是否过期',
      '联系管理员获取新的密钥'
    ]
  },
  rateLimit: {
    icon: Clock,
    title: '请求过于频繁',
    description: '您的请求频率过高，已触发限流。请稍后再试。',
    emoji: '🚦',
    suggestions: [
      '稍后重试',
      '降低请求频率',
      '联系管理员增加限流配额'
    ]
  },
  unknown: {
    icon: AlertTriangle,
    title: '发生了未知错误',
    description: '系统遇到了未知问题，请尝试重新操作或刷新页面。',
    emoji: '⚠️',
    suggestions: [
      '重新尝试操作',
      '刷新页面',
      '如果问题持续存在，请联系技术支持'
    ]
  }
};

// 检测错误类型
const detectErrorType = (message: string): keyof typeof ERROR_TYPES => {
  if (ERROR_PATTERNS.network.test(message)) return 'network';
  if (ERROR_PATTERNS.notFound.test(message)) return 'notFound';
  if (ERROR_PATTERNS.timeout.test(message)) return 'timeout';
  if (ERROR_PATTERNS.server.test(message)) return 'server';
  if (ERROR_PATTERNS.auth.test(message)) return 'auth';
  if (ERROR_PATTERNS.rateLimit.test(message)) return 'rateLimit';
  return 'unknown';
};

export interface QuickErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
  compact?: boolean;
}

// 一个简单快速的错误显示组件，无需复杂配置，直接检测错误类型并显示
export const QuickErrorDisplay: FC<QuickErrorDisplayProps> = ({
  message,
  onRetry,
  onClose,
  compact = false
}) => {
  // 错误类型
  const errorType = useMemo(() => detectErrorType(message), [message]);
  
  // 错误配置
  const errorConfig = ERROR_TYPES[errorType];
  
  // 重试计数
  const [retryCount, setRetryCount] = useState(0);
  const maxRetryCount = 3;
  
  // 处理重试
  const handleRetry = () => {
    if (retryCount < maxRetryCount) {
      setRetryCount(prev => prev + 1);
      if (onRetry) {
        onRetry();
      }
    }
  };
  
  return (
    <div className={`rounded-lg border p-${compact ? '3' : '4'} bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5">
          {errorConfig.emoji}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium text-red-800 dark:text-red-200">
              {errorConfig.title}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
                aria-label="关闭"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="text-sm text-red-700 dark:text-red-300">
            {errorConfig.description}
          </div>
          
          {!compact && (
            <div className="space-y-1 pt-1">
              <div className="text-xs font-medium text-red-600 dark:text-red-400">
                建议解决方案:
              </div>
              <ul className="text-xs text-red-700 dark:text-red-300 space-y-0.5 pl-1">
                {errorConfig.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm pt-1">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:bg-red-700 dark:hover:bg-red-600 dark:disabled:bg-red-800/50 text-sm"
              disabled={retryCount >= maxRetryCount}
            >
              <RefreshCw className="h-3 w-3" /> 
              重试
              {retryCount > 0 && (
                <span className="ml-1 text-xs opacity-80">
                  ({retryCount}/{maxRetryCount})
                </span>
              )}
            </button>
            
            {!compact && (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-sm"
              >
                刷新页面
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
