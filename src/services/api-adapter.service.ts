/**
 * API 适配服务
 * 模拟 Next.js API 路由功能，统一 API 调用接口
 * 对外提供 /api/chat 等接口，内部通过AI SDK转发到 liteLLM 服务
 */

// 声明全局变量类型
declare global {
  interface Window {
    __apiAdapterInitialized?: boolean;
  }
}

import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

// 消息内容类型定义
export interface MessageContent {
  type: 'text';
  text: string;
}

// API 请求接口定义
export interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string | MessageContent[];
  }>;
  model?: string;
  stream?: boolean;
  systemPrompt?: string; // 系统提示词，用于约束AI助手的回答范围
}

// API 响应接口定义
export interface ChatResponse {
  content?: string;
  error?: string;
  errorDetails?: {
    code?: string | number;
    type?: string;
    statusCode?: number;
    message?: string;
    suggestions?: string[];
  };
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// 默认配置
const DEFAULT_CONFIG = {
  model: 'qwen-plus'
};

/**
 * API 适配器类
 */
export class ApiAdapterService {
  private static instance: ApiAdapterService;
  private isInterceptorSetup = false; // 防止重复设置拦截器

  private constructor() { }

  public static getInstance(): ApiAdapterService {
    if (!ApiAdapterService.instance) {
      ApiAdapterService.instance = new ApiAdapterService();
    }
    return ApiAdapterService.instance;
  }

  /**
   * 获取当前设置
   */
  private getCurrentSettings() {
    return {
      model: DEFAULT_CONFIG.model
    };
  }

  /**
   * 创建 AI 客户端 - 配置为使用 liteLLM 服务
   */
  private createClient() {
    // 恢复使用正确的 liteLLM 端点
    const baseURL = '/api';
    
    return createOpenAI({
      apiKey: 'dummy-key', // liteLLM不需要，但AI SDK需要一个值
      baseURL,
      // 添加自定义 fetch 函数，避免被拦截器拦截
      fetch: (url: RequestInfo | URL, init?: RequestInit) => {
        // 为内部请求添加特殊标识
        const newInit = {
          ...init,
          headers: {
            ...init?.headers,
            'X-Internal-Request': 'true', // 标识这是内部请求
          },
        };
        // 调用原始的 fetch，绕过拦截器
        return (globalThis as any).__originalFetch(url, newInit);
      },
    });
  }

  /**
   * 提取文本内容 - 统一处理不同格式的消息内容
   */
  private extractTextContent(content: string | MessageContent[]): string {
    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      // assistant-ui 格式：[{type: 'text', text: '...'}]
      return content
        .filter((part: MessageContent) => part.type === 'text')
        .map((part: MessageContent) => part.text)
        .join('');
    } else {
      // 兜底：转换为字符串
      return String(content);
    }
  }

  /**
   * 转换消息格式
   */
  private convertMessages(messages: ChatRequest['messages']): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    return messages.map(msg => ({
      role: msg.role,
      content: this.extractTextContent(msg.content)
    }));
  }

  /**
   * 处理系统提示词，将其添加到消息数组开头
   */
  private processMessagesWithSystemPrompt(messages: ChatRequest['messages'], systemPrompt?: string): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const convertedMessages = this.convertMessages(messages);
    
    // 如果有系统提示词，且现有消息中没有系统消息，则添加到开头
    if (systemPrompt && systemPrompt.trim()) {
      const hasSystemMessage = convertedMessages.some(msg => msg.role === 'system');
      
      if (!hasSystemMessage) {
        // 在消息数组开头插入系统提示词
        convertedMessages.unshift({
          role: 'system',
          content: systemPrompt.trim()
        });
      }
    }
    
    return convertedMessages;
  }

  /**
   * 安全地提取错误信息
   */
  private getErrorDetails(error: unknown) {
    if (error instanceof Error) {
      // 检查是否是 AI SDK 的错误
      const aiError = error as any;
      
      // 处理网络错误
      if (error.message.includes('fetch')) {
        return {
          type: 'NetworkError',
          code: 'NETWORK_ERROR',
          statusCode: 0,
          message: '网络连接失败，请检查网络连接',
          suggestions: [
            '请检查网络连接是否正常',
            '请检查服务器是否可访问',
            '稍后重试'
          ]
        };
      }
      
      // 处理 404 错误
      if (error.message.includes('404') || aiError.status === 404) {
        return {
          type: 'NotFoundError',
          code: 'MODEL_NOT_FOUND',
          statusCode: 404,
          message: '模型或服务端点未找到',
          suggestions: [
            '请检查模型名称是否正确',
            '请检查 API 端点配置是否正确',
            '请联系管理员确认服务状态'
          ]
        };
      }
      
      // 处理认证错误
      if (error.message.includes('401') || aiError.status === 401) {
        return {
          type: 'AuthenticationError',
          code: 'UNAUTHORIZED',
          statusCode: 401,
          message: 'API 密钥无效或已过期',
          suggestions: [
            '请检查 API 密钥是否正确',
            '请确认 API 密钥是否有效',
            '请联系管理员获取新的密钥'
          ]
        };
      }
      
      // 处理限流错误
      if (error.message.includes('429') || aiError.status === 429) {
        return {
          type: 'RateLimitError',
          code: 'TOO_MANY_REQUESTS',
          statusCode: 429,
          message: '请求过于频繁，已触发限流',
          suggestions: [
            '请稍后重试',
            '请降低请求频率',
            '请联系管理员增加限流配额'
          ]
        };
      }
      
      // 处理服务器错误
      if (error.message.includes('500') || aiError.status >= 500) {
        return {
          type: 'ServerError',
          code: 'INTERNAL_SERVER_ERROR',
          statusCode: aiError.status || 500,
          message: '服务器内部错误',
          suggestions: [
            '请稍后重试',
            '如果问题持续存在，请联系管理员',
            '请检查服务器状态'
          ]
        };
      }
      
      // 处理超时错误
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        return {
          type: 'TimeoutError',
          code: 'REQUEST_TIMEOUT',
          statusCode: 408,
          message: '请求超时',
          suggestions: [
            '请稍后重试',
            '请检查网络连接稳定性',
            '请尝试缩短消息长度'
          ]
        };
      }
      
      return {
        type: 'UnknownError',
        code: error.name || 'UNKNOWN_ERROR',
        statusCode: aiError.status || 0,
        message: error.message || '未知错误',
        suggestions: [
          '请稍后重试',
          '如果问题持续存在，请联系技术支持'
        ]
      };
    }
    
    return {
      type: 'UnknownError',
      code: 'UNKNOWN_ERROR',
      statusCode: 0,
      message: String(error) || '发生了未知错误',
      suggestions: [
        '请稍后重试',
        '如果问题持续存在，请联系技术支持'
      ]
    };
  }

  /**
   * 处理聊天请求 - 流式响应
   */
  public async handleChatStream(request: ChatRequest): Promise<ReadableStream> {
    try {
      if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
        throw new Error('Invalid request: messages array is required and cannot be empty.');
      }
      const convertedMessages = this.processMessagesWithSystemPrompt(request.messages, request.systemPrompt);
      const model = request.model || DEFAULT_CONFIG.model;
      
      const client = this.createClient();
      const result = await streamText({
        model: client(model),
        messages: convertedMessages,
        maxTokens: 1000,
        temperature: 0.7,
      });
      return result.toDataStreamResponse().body!;
    } catch (error) {
      // 对于流式响应，我们需要创建一个包含错误信息的流
      const errorDetails = this.getErrorDetails(error);
      const errorResponse = {
        error: errorDetails.message,
        errorDetails
      };
      
      // 创建一个立即返回错误的流
      const encoder = new TextEncoder();
      const errorData = `data: ${JSON.stringify(errorResponse)}\n\n`;
      
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      });
    }
  }

  /**
   * 处理聊天请求 - 非流式响应
   */
  public async handleChat(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
        throw new Error('Invalid request: messages array is required and cannot be empty.');
      }
      const convertedMessages = this.processMessagesWithSystemPrompt(request.messages, request.systemPrompt);
      const model = request.model || DEFAULT_CONFIG.model;
      const client = this.createClient();
      const result = await generateText({
        model: client(model),
        messages: convertedMessages,
        maxTokens: 1000,
        temperature: 0.7,
      });
      return {
        content: result.text,
        model,
        usage: {
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
        },
      };
    } catch (error) {
      const errorDetails = this.getErrorDetails(error);
      return {
        error: errorDetails.message,
        errorDetails,
      };
    }
  }

  /**
   * 模拟 Next.js API 路由的 fetch 拦截器
   */
  public setupApiInterceptor() {
    if (this.isInterceptorSetup) {
      return;
    }
    
    // 保存原始 fetch 函数，供内部请求使用
    (globalThis as any).__originalFetch = window.fetch;
    
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      // 检查是否是内部请求（来自 AI SDK）
      const isInternalRequest = init?.headers && 
        (init.headers as any)['X-Internal-Request'] === 'true';
      
      // 如果是内部请求，直接调用原始 fetch，不进行拦截
      if (isInternalRequest) {
        return originalFetch(input, init);
      }
      
      // 处理 OPTIONS 预检请求
      if (init?.method === 'OPTIONS' && url.includes('/api/')) {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
      
      // 改进的本地API请求判断逻辑
      // 检查是否是聊天API请求，无论是相对路径还是完整URL
      const isLocalApiRequest = (
        url.includes('/api/chat') && 
        (
          // 相对路径：/api/chat
          url.startsWith('/api/chat') ||
          // 当前域名的完整URL：https://marsio.top/api/chat
          url.startsWith(window.location.origin + '/api/chat') ||
          // 处理其他相对路径格式
          url === '/api/chat' ||
          url.endsWith('/api/chat')
        )
      ) || (
        // 兼容处理：确保所有到本域名的/api/chat请求都被拦截
        url.includes('/api/chat') && 
        new URL(url, window.location.origin).origin === window.location.origin
      );
      
      // 添加调试日志
      if (url.includes('/api/chat')) {
        console.log('🔍 API拦截器检测到聊天请求:', {
          url,
          origin: window.location.origin,
          isLocalApiRequest,
          userAgent: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'
        });
      }
      
      if (isLocalApiRequest) {
        console.log('✅ 请求被本地拦截器处理');
        try {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const isStream = body.stream !== false;
          
          console.log('📡 处理聊天请求:', {
            isStream,
            model: body.model || DEFAULT_CONFIG.model,
            messageCount: body.messages?.length || 0
          });
          
          if (isStream) {
            const stream = await this.handleChatStream(body);
            console.log('🌊 返回流式响应');
            return new Response(stream, {
              status: 200,
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              },
            });
          } else {
            const result = await this.handleChat(body);
            console.log('💬 返回非流式响应:', {
              hasContent: !!result.content,
              hasError: !!result.error,
              hasUsage: !!result.usage,
              completionTokens: result.usage?.completionTokens
            });
            return new Response(JSON.stringify(result), {
              status: result.error ? 400 : 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              },
            });
          }
        } catch (error) {
          console.error('❌ 本地API处理失败:', error);
          const errorDetails = this.getErrorDetails(error);
          return new Response(
            JSON.stringify({
              error: errorDetails.message,
              errorDetails
            }),
            {
              status: errorDetails.statusCode || 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              },
            }
          );
        }
      } else if (url.includes('/api/chat')) {
        console.log('⚠️  请求未被拦截，将发送到远程服务器');
      }
      
      // 处理连接测试请求
      if (url.includes('/api/ping')) {
        try {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const result = await this.testConnection(body);
          return new Response(JSON.stringify(result), {
            status: result.error ? 400 : 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Internal server error'
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      }
      
      return originalFetch(input, init);
    };
    this.isInterceptorSetup = true;
  }

  /**
   * 测试连接
   */
  private async testConnection(params: { model?: string }) {
    try {
      const settings = this.getCurrentSettings();
      const config = {
        model: params.model || settings.model,
      };
      const client = this.createClient();
      const result = await generateText({
        model: client(config.model),
        messages: [{ role: 'user', content: 'Hello' }],
        maxTokens: 10,
      });
      return {
        message: 'Connection test successful',
        model: config.model,
        timestamp: new Date().toISOString(),
        status: 'ok',
        responseData: {
          text: result.text,
          usage: result.usage,
        },
      };
    } catch (error) {
      return {
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestions: [
          '请检查网络连接是否正常',
          '请检查liteLLM服务是否正常运行',
          '请检查模型名称是否正确',
        ],
      };
    }
  }
}

// 导出单例实例
export const apiAdapter = ApiAdapterService.getInstance();

// 导出便捷方法
export const setupApiAdapter = () => {
  apiAdapter.setupApiInterceptor();
};
