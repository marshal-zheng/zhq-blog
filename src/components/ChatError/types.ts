import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// 错误严重程度
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

// 错误类别
export type ErrorCategory = 
  | 'network'        // 网络相关错误
  | 'auth'          // 认证相关错误
  | 'rate_limit'    // 限流错误
  | 'server'        // 服务器错误
  | 'model'         // 模型相关错误
  | 'validation'    // 验证错误
  | 'timeout'       // 超时错误
  | 'unknown';      // 未知错误

// 用户操作建议类型
export interface ActionSuggestion {
  text: string;
  action?: () => void;
  type?: 'primary' | 'secondary';
  icon?: LucideIcon;
}

// 错误详情接口
export interface ErrorDetails {
  // 基本信息
  code?: string | number;
  statusCode?: number;
  category: ErrorCategory;
  severity: ErrorSeverity;
  
  // 用户友好的信息
  title: string;
  description: string;
  
  // 技术信息（可选显示）
  technicalMessage?: string;
  stack?: string;
  
  // 用户操作建议
  suggestions: ActionSuggestion[];
  
  // 元数据
  timestamp?: Date;
  endpoint?: string;
  model?: string;
}

// 错误配置接口
export interface ErrorConfig {
  // 显示设置
  showTechnicalDetails: boolean;
  showTimestamp: boolean;
  autoHideDelay?: number; // 自动隐藏延迟（毫秒）
  
  // 主题设置
  theme: 'auto' | 'light' | 'dark';
  compact: boolean; // 紧凑模式
  
  // 行为设置
  allowRetry: boolean;
  maxRetryCount: number;
  enableReporting: boolean; // 是否允许错误报告
  
  // 自定义渲染
  customRenderer?: (error: ErrorDetails) => ReactNode;
}

// 错误处理器接口
export interface ErrorHandler {
  canHandle(error: unknown): boolean;
  handle(error: unknown): ErrorDetails;
}
