import { useEffect, useState } from 'react';
import { errorHandlerRegistry } from './handlers';

/**
 * 创建一个全局错误处理实例
 * 可以在应用中任何位置使用
 */
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorCallbacks: ((error: unknown) => void)[] = [];
  
  private constructor() {}
  
  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }
  
  /**
   * 处理错误并通知所有监听器
   */
  handleError(error: unknown): void {
    const errorDetails = errorHandlerRegistry.handle(error);
    console.error('全局错误:', errorDetails);
    
    this.errorCallbacks.forEach(callback => {
      try {
        callback(errorDetails);
      } catch (callbackError) {
        console.error('错误回调执行失败:', callbackError);
      }
    });
  }
  
  /**
   * 注册错误监听器
   */
  addErrorListener(callback: (error: unknown) => void): () => void {
    this.errorCallbacks.push(callback);
    
    // 返回取消监听的函数
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }
}

// 导出全局单例
export const globalErrorHandler = GlobalErrorHandler.getInstance();
