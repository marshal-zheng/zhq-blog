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
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'NETWORK_ERROR',
      category: 'network',
      severity: 'error',
      title: '网络连接失败',
      description: '无法连接到服务器，请检查您的网络连接。',
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
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'MODEL_NOT_FOUND',
      statusCode: 404,
      category: 'model',
      severity: 'error',
      title: '模型不可用',
      description: '当前选择的AI模型暂时不可用，请联系管理员。',
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
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'UNAUTHORIZED',
      statusCode: 401,
      category: 'auth',
      severity: 'error',
      title: '身份验证失败',
      description: 'API密钥无效或已过期，请联系系统管理员。',
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
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      category: 'rate_limit',
      severity: 'warning',
      title: '请求过于频繁',
      description: '您的请求频率超出限制，请稍后访问。',
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
    
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'SERVER_ERROR',
      statusCode,
      category: 'server',
      severity: 'critical',
      title: '服务器暂时不可用',
      description: '服务器遇到了内部错误，请稍后访问。',
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
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'REQUEST_TIMEOUT',
      statusCode: 408,
      category: 'timeout',
      severity: 'warning',
      title: '请求超时',
      description: '服务器响应时间过长，请稍后再次尝试。',
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
    const suggestions: ActionSuggestion[] = [];

    return {
      code: 'UNKNOWN_ERROR',
      category: 'unknown',
      severity: 'error',
      title: '系统错误',
      description: '系统遇到了未知问题，请联系技术支持。',
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
