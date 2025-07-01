import type { ErrorDetails, ErrorHandler, ActionSuggestion } from './types';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  Shield, 
  Server, 
  AlertTriangle, 
  RefreshCw,
  Settings,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

// 网络错误处理器
export class NetworkErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('fetch') || 
             error.message.includes('network') ||
             error.message.includes('connection') ||
             (error as any).code === 'NETWORK_ERROR';
    }
    return false;
  }

  handle(error: unknown): ErrorDetails {
    const suggestions: ActionSuggestion[] = [
      {
        text: '检查网络连接',
        icon: Wifi,
        type: 'primary',
        action: () => {
          // 可以添加网络检测逻辑
          console.log('检查网络连接...');
        }
      },
      {
        text: '重试请求',
        icon: RefreshCw,
        type: 'secondary'
      },
      {
        text: '查看网络状态',
        icon: ExternalLink,
        type: 'secondary',
        action: () => {
          window.open('https://www.speedtest.net/', '_blank');
        }
      }
    ];

    return {
      code: 'NETWORK_ERROR',
      category: 'network',
      severity: 'error',
      title: '网络连接失败',
      description: '无法连接到服务器，请检查您的网络连接后重试。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 404错误处理器
export class NotFoundErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    if (error instanceof Error) {
      const statusCode = (error as any).status || (error as any).statusCode;
      return statusCode === 404 || error.message.includes('404');
    }
    return false;
  }

  handle(error: unknown): ErrorDetails {
    const suggestions: ActionSuggestion[] = [
      {
        text: '检查模型配置',
        icon: Settings,
        type: 'primary',
        action: () => {
          console.log('打开模型配置...');
        }
      },
      {
        text: '重新选择模型',
        icon: MessageSquare,
        type: 'secondary'
      },
      {
        text: '联系技术支持',
        icon: ExternalLink,
        type: 'secondary',
        action: () => {
          // 可以打开技术支持页面
          console.log('联系技术支持...');
        }
      }
    ];

    return {
      code: 'MODEL_NOT_FOUND',
      statusCode: 404,
      category: 'model',
      severity: 'error',
      title: '模型不可用',
      description: '当前选择的AI模型暂时不可用，请尝试选择其他模型或检查配置。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 认证错误处理器
export class AuthErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    if (error instanceof Error) {
      const statusCode = (error as any).status || (error as any).statusCode;
      return statusCode === 401 || statusCode === 403 || error.message.includes('unauthorized');
    }
    return false;
  }

  handle(error: unknown): ErrorDetails {
    const suggestions: ActionSuggestion[] = [
      {
        text: '检查API密钥',
        icon: Shield,
        type: 'primary',
        action: () => {
          console.log('打开API密钥设置...');
        }
      },
      {
        text: '重新登录',
        icon: RefreshCw,
        type: 'secondary'
      },
      {
        text: '联系管理员',
        icon: ExternalLink,
        type: 'secondary'
      }
    ];

    return {
      code: 'UNAUTHORIZED',
      statusCode: 401,
      category: 'auth',
      severity: 'error',
      title: '身份验证失败',
      description: 'API密钥无效或已过期，请检查您的认证信息。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 限流错误处理器
export class RateLimitErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    if (error instanceof Error) {
      const statusCode = (error as any).status || (error as any).statusCode;
      return statusCode === 429 || error.message.includes('rate limit');
    }
    return false;
  }

  handle(error: unknown): ErrorDetails {
    const suggestions: ActionSuggestion[] = [
      {
        text: '稍后重试',
        icon: Clock,
        type: 'primary'
      },
      {
        text: '减慢请求频率',
        icon: Settings,
        type: 'secondary'
      },
      {
        text: '升级套餐',
        icon: ExternalLink,
        type: 'secondary',
        action: () => {
          console.log('打开升级页面...');
        }
      }
    ];

    return {
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      category: 'rate_limit',
      severity: 'warning',
      title: '请求过于频繁',
      description: '您的请求频率过高，请稍等片刻后再试。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 服务器错误处理器
export class ServerErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    if (error instanceof Error) {
      const statusCode = (error as any).status || (error as any).statusCode;
      return statusCode >= 500 || error.message.includes('server error');
    }
    return false;
  }

  handle(error: unknown): ErrorDetails {
    const statusCode = (error as any)?.status || (error as any)?.statusCode || 500;
    
    const suggestions: ActionSuggestion[] = [
      {
        text: '稍后重试',
        icon: RefreshCw,
        type: 'primary'
      },
      {
        text: '检查服务状态',
        icon: Server,
        type: 'secondary',
        action: () => {
          window.open('https://status.marsio.top', '_blank');
        }
      },
      {
        text: '报告问题',
        icon: ExternalLink,
        type: 'secondary'
      }
    ];

    return {
      code: 'SERVER_ERROR',
      statusCode,
      category: 'server',
      severity: 'critical',
      title: '服务器暂时不可用',
      description: '服务器遇到了内部错误，我们正在努力修复。请稍后重试。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 超时错误处理器
export class TimeoutErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('timeout') || 
             error.message.includes('AbortError') ||
             error.name === 'TimeoutError';
    }
    return false;
  }

  handle(error: unknown): ErrorDetails {
    const suggestions: ActionSuggestion[] = [
      {
        text: '重试请求',
        icon: RefreshCw,
        type: 'primary'
      },
      {
        text: '缩短消息长度',
        icon: MessageSquare,
        type: 'secondary'
      },
      {
        text: '检查网络稳定性',
        icon: Wifi,
        type: 'secondary'
      }
    ];

    return {
      code: 'REQUEST_TIMEOUT',
      statusCode: 408,
      category: 'timeout',
      severity: 'warning',
      title: '请求超时',
      description: '服务器响应时间过长，请尝试重新发送消息。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 默认错误处理器
export class DefaultErrorHandler implements ErrorHandler {
  canHandle(_error: unknown): boolean {
    return true; // 兜底处理器，处理所有未匹配的错误
  }

  handle(error: unknown): ErrorDetails {
    const suggestions: ActionSuggestion[] = [
      {
        text: '重试',
        icon: RefreshCw,
        type: 'primary'
      },
      {
        text: '刷新页面',
        icon: ExternalLink,
        type: 'secondary',
        action: () => window.location.reload()
      },
      {
        text: '联系技术支持',
        icon: ExternalLink,
        type: 'secondary'
      }
    ];

    return {
      code: 'UNKNOWN_ERROR',
      category: 'unknown',
      severity: 'error',
      title: '出现了意外错误',
      description: '抱歉，系统遇到了未知问题。请尝试重新操作或联系技术支持。',
      technicalMessage: error instanceof Error ? error.message : String(error),
      suggestions,
      timestamp: new Date()
    };
  }
}

// 错误处理器注册表
export class ErrorHandlerRegistry {
  private handlers: ErrorHandler[] = [];

  constructor() {
    // 注册所有处理器，顺序很重要
    this.registerHandler(new NetworkErrorHandler());
    this.registerHandler(new NotFoundErrorHandler());
    this.registerHandler(new AuthErrorHandler());
    this.registerHandler(new RateLimitErrorHandler());
    this.registerHandler(new ServerErrorHandler());
    this.registerHandler(new TimeoutErrorHandler());
    this.registerHandler(new DefaultErrorHandler()); // 默认处理器放最后
  }

  registerHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }

  handle(error: unknown): ErrorDetails {
    for (const handler of this.handlers) {
      if (handler.canHandle(error)) {
        return handler.handle(error);
      }
    }
    
    // 理论上不会到这里，因为有默认处理器
    return new DefaultErrorHandler().handle(error);
  }
}

// 单例实例
export const errorHandlerRegistry = new ErrorHandlerRegistry();
