import type { FC } from "react";
import { useState } from "react";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";

export interface ErrorDetails {
  type?: string;
  code?: string | number;
  statusCode?: number;
  message?: string;
  suggestions?: string[];
}

export interface ChatErrorDisplayProps {
  error: string;
  errorDetails?: ErrorDetails;
  onRetry?: () => void;
}

export const ChatErrorDisplay: FC<ChatErrorDisplayProps> = ({
  error,
  errorDetails,
  onRetry,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // 根据错误类型返回相应的图标
  const getErrorIcon = () => {
    if (errorDetails?.type === 'NetworkError') {
      return <WifiOff className="h-4 w-4" />;
    }
    if (errorDetails?.statusCode === 404) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  // 根据错误类型返回相应的颜色主题
  const getErrorTheme = () => {
    if (errorDetails?.type === 'NetworkError') {
      return {
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        textColor: 'text-orange-800 dark:text-orange-200',
        borderColor: 'border-orange-200 dark:border-orange-800',
        iconColor: 'text-orange-600 dark:text-orange-400',
      };
    }
    return {
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      textColor: 'text-red-800 dark:text-red-200',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
    };
  };

  const theme = getErrorTheme();

  return (
    <div className={`rounded-lg border p-4 ${theme.bgColor} ${theme.borderColor}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${theme.iconColor}`}>
          {getErrorIcon()}
        </div>
        <div className="flex-1 space-y-2">
          <div className={`font-medium ${theme.textColor}`}>
            {error || '发生了未知错误'}
          </div>

          {errorDetails && (
            <>
              {/* 状态码和错误类型 */}
              {(errorDetails.statusCode || errorDetails.type) && (
                <div className="flex items-center gap-2 text-xs">
                  {errorDetails.statusCode && (
                    <span className={`px-2 py-1 rounded font-mono ${theme.bgColor} ${theme.textColor} border ${theme.borderColor}`}>
                      {errorDetails.statusCode}
                    </span>
                  )}
                  {errorDetails.type && (
                    <span className="text-muted-foreground bg-muted px-2 py-1 rounded text-xs">
                      {errorDetails.type}
                    </span>
                  )}
                </div>
              )}

              {/* 建议解决方案 */}
              {errorDetails.suggestions && errorDetails.suggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    建议解决方案:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {errorDetails.suggestions.slice(0, 3).map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 显示更多详情按钮 */}
              {(errorDetails.code || (errorDetails.suggestions && errorDetails.suggestions.length > 3)) && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  {showDetails ? '隐藏详情' : '显示更多详情'}
                </button>
              )}

              {/* 详细信息 */}
              {showDetails && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  {errorDetails.code && (
                    <div className="text-xs">
                      <span className="font-medium text-muted-foreground">错误代码: </span>
                      <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                        {errorDetails.code}
                      </code>
                    </div>
                  )}
                  
                  {errorDetails.suggestions && errorDetails.suggestions.length > 3 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        其他建议:
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {errorDetails.suggestions.slice(3).map((suggestion, index) => (
                          <li key={index + 3} className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 重试按钮 */}
          {onRetry && (
            <div className="pt-2">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                重试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 用于在 Thread 组件中显示错误的简化版本
export const SimpleChatError: FC<{ message: string }> = ({ message }) => {
  // 尝试解析错误消息中的详细信息
  let errorDetails: ErrorDetails | undefined;
  let errorMessage = message;

  try {
    const parsed = JSON.parse(message);
    if (parsed.errorDetails) {
      errorDetails = parsed.errorDetails;
      errorMessage = parsed.error || parsed.message || message;
    }
  } catch {
    // 如果解析失败，使用原始消息
  }

  return (
    <ChatErrorDisplay
      error={errorMessage}
      errorDetails={errorDetails}
    />
  );
};
