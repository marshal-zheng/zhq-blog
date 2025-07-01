import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Bug,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { ErrorDetails, ErrorConfig, ActionSuggestion } from './types';
import { 
  defaultErrorConfig, 
  severityConfig, 
  categoryIcons, 
  friendlyMessages,
  getCurrentEnvironmentConfig
} from './config';
import { cn } from '@assets/lib/utils';

export interface ChatErrorProps {
  error: ErrorDetails;
  config?: Partial<ErrorConfig>;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ChatError: FC<ChatErrorProps> = ({
  error,
  config: userConfig = {},
  onRetry,
  onClose
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // 合并配置
  const config: ErrorConfig = {
    ...defaultErrorConfig,
    ...getCurrentEnvironmentConfig(),
    ...userConfig
  };

  // 自动隐藏逻辑
  useEffect(() => {
    if (config.autoHideDelay && onClose) {
      const timer = setTimeout(onClose, config.autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [config.autoHideDelay, onClose]);

  // 获取样式主题
  const theme = severityConfig[error.severity];
  const categoryIcon = categoryIcons[error.category];
  const friendlyMessage = friendlyMessages[error.category];

  // 处理重试
  const handleRetry = () => {
    if (retryCount < config.maxRetryCount && onRetry) {
      setRetryCount(prev => prev + 1);
      onRetry();
    }
  };

  // 复制错误信息
  const copyErrorInfo = async () => {
    const errorInfo = {
      title: error.title,
      description: error.description,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp?.toISOString(),
      technicalMessage: error.technicalMessage
    };
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
      // 可以添加提示
      console.log('错误信息已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 渲染操作建议
  const renderActionSuggestion = (suggestion: ActionSuggestion, index: number) => {
    const Icon = suggestion.icon;
    const isPrimary = suggestion.type === 'primary';
    
    return (
      <button
        key={index}
        onClick={() => {
          if (suggestion.text === '重试请求' || suggestion.text === '重试') {
            handleRetry();
          } else if (suggestion.action) {
            suggestion.action();
          }
        }}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          isPrimary 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
        disabled={suggestion.text.includes('重试') && retryCount >= config.maxRetryCount}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {suggestion.text}
        {suggestion.text.includes('重试') && retryCount > 0 && (
          <span className="text-xs opacity-70">({retryCount}/{config.maxRetryCount})</span>
        )}
      </button>
    );
  };

  return (
    <div className={cn(
      'rounded-lg border p-4 shadow-sm',
      theme.bgColor,
      theme.borderColor,
      config.compact && 'p-3'
    )}>
      {/* 头部 */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full text-lg',
            theme.iconColor,
            'bg-white/20 dark:bg-black/20'
          )}>
            {categoryIcon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn('font-semibold text-base', theme.textColor)}>
              {friendlyMessage.emoji} {error.title}
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                ×
              </button>
            )}
          </div>
          
          {/* 描述 */}
          <p className={cn('text-sm mb-3', theme.textColor)}>
            {error.description}
          </p>
          
          {/* 状态码和时间戳 */}
          {(error.statusCode || (config.showTimestamp && error.timestamp)) && (
            <div className="flex items-center gap-2 mb-3 text-xs">
              {error.statusCode && (
                <span className={cn(
                  'px-2 py-1 rounded font-mono',
                  'bg-white/30 dark:bg-black/30',
                  theme.textColor
                )}>
                  {error.statusCode}
                </span>
              )}
              {config.showTimestamp && error.timestamp && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {error.timestamp.toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
          
          {/* 操作建议 */}
          {error.suggestions.length > 0 && (
            <div className="space-y-2 mb-3">
              <div className="flex flex-wrap gap-2">
                {error.suggestions.slice(0, 2).map(renderActionSuggestion)}
              </div>
              {error.suggestions.length > 2 && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    更多选项
                  </summary>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {error.suggestions.slice(2).map(renderActionSuggestion)}
                  </div>
                </details>
              )}
            </div>
          )}
          
          {/* 技术详情 */}
          {config.showTechnicalDetails && error.technicalMessage && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Bug className="h-3 w-3" />
                技术详情
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              
              {showDetails && (
                <div className="mt-2 space-y-2">
                  <div className="bg-muted rounded p-2 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">错误详情:</span>
                      <button
                        onClick={copyErrorInfo}
                        className="text-muted-foreground hover:text-foreground"
                        title="复制错误信息"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-foreground break-all">
                      {error.technicalMessage}
                    </div>
                    {error.code && (
                      <div className="text-muted-foreground mt-1">
                        错误代码: {error.code}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 报告问题 */}
          {config.enableReporting && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <button
                onClick={() => {
                  // 这里可以实现错误报告逻辑
                  console.log('报告错误:', error);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                报告此问题
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
