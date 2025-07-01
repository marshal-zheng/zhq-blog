import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy,
  WifiIcon,
  LockIcon,
  ClockIcon,
  ServerIcon,
  BrainIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  HelpCircleIcon,
  XIcon,
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

// 图标映射
const iconComponents = {
  WifiIcon,
  LockIcon,
  ClockIcon,
  ServerIcon,
  BrainIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  HelpCircleIcon,
};

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
  const iconName = categoryIcons[error.category];
  const CategoryIcon = iconComponents[iconName as keyof typeof iconComponents] || HelpCircleIcon;
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

  // 操作建议功能已移除

  return (
    <div className={cn(
      'rounded-md border shadow-sm',
      theme.bgColor,
      theme.borderColor,
      config.compact ? 'p-2.5' : 'p-3'
    )}>
      {/* 头部 - 更专业的企业级设计 */}
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0">
          <div className={cn(
            'flex items-center justify-center w-6 h-6',
            theme.iconColor
          )}>
            <CategoryIcon size={16} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 标题 - 更简洁专业的样式 */}
          <div className="flex items-center justify-between mb-1.5">
            <h3 className={cn('font-medium text-sm', theme.textColor)}>
              {error.title}
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
                aria-label="关闭"
              >
                <XIcon size={14} />
              </button>
            )}
          </div>
          
          {/* 描述 - 更清晰的字体和间距 */}
          <p className={cn('text-xs leading-5', theme.textColor)}>
            {error.description}
          </p>
          
          {/* 错误码显示 - 简洁专业 */}
          {error.statusCode && (
            <div className="mt-2">
              <span className={cn(
                'inline-block text-xs py-0.5 px-1.5 rounded-sm font-mono',
                'bg-white/10 dark:bg-black/20',
                theme.textColor
              )}>
                {error.code || `错误 ${error.statusCode}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
