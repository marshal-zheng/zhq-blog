import React, { useState, useEffect, Suspense, lazy, useRef, useCallback } from 'react';
import AssistantPopover from './AssistantUI/Modal';
import { ShineBorder } from './ShineBorder/ShineBorder';

// === Bubble modal geometry ===
const BUBBLE_WIDTH = 430;    // 与样式保持一致
const BUBBLE_HEIGHT = 580;   // 与样式保持一致
const TOOLBAR_OFFSET = 110;  // toolbar 顶部到容器 top 的偏移量

const Spline = lazy(() => import('@splinetool/react-spline'));

interface FloatingRobotProps {
  mode?: 'fullscreen' | 'bubble'; // 全屏模式或气泡模式
}

const FloatingRobot: React.FC<FloatingRobotProps> = ({ mode = 'fullscreen' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // 拖拽相关状态和引用
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // 直接通过状态更新位置，避免DOM操作导致的双重位移
  const applyTransform = useCallback((x: number, y: number) => {
    // 直接更新状态而不是操作DOM
    setBubblePosition({ x, y });
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 检查当前主题
    const checkTheme = () => {
      if (typeof window !== 'undefined') {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setIsDarkTheme(isDark);
      }
    };

    // 窗口大小变化时重新调整气泡位置
    const handleResize = () => {
      checkIsMobile();
      
      // 如果是气泡模式且有位置信息，重新计算边界
      if (currentMode === 'bubble' && (bubblePosition.x !== 0 || bubblePosition.y !== 0)) {
        const bubbleWidth = BUBBLE_WIDTH;
        const bubbleHeight = BUBBLE_HEIGHT;
        const padding = 10;
        
        const maxX = Math.max(0, window.innerWidth - bubbleWidth - padding);
        // const maxY = Math.max(0, window.innerHeight - bubbleHeight - padding);
        // const minX = padding;
        // const minY = padding;
        const minX = padding;
        const minY = TOOLBAR_OFFSET; // 顶部最小值，保证 top ≥ 0
        const maxY = Math.max(0, window.innerHeight - (bubbleHeight - TOOLBAR_OFFSET));
        
        const newX = Math.max(minX, Math.min(bubblePosition.x, maxX));
        const newY = Math.max(minY, Math.min(bubblePosition.y, maxY));
        
        if (newX !== bubblePosition.x || newY !== bubblePosition.y) {
          setBubblePosition({ x: newX, y: newY });
        }
      }
    };

    // 主题变化监听器
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    // 开始监听
    if (typeof window !== 'undefined') {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    checkTheme();
    handleResize();
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      themeObserver.disconnect();
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentMode, bubblePosition]);

  // 获取默认位置
  const getDefaultPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    
    const bubbleWidth = BUBBLE_WIDTH;
    const bubbleHeight = BUBBLE_HEIGHT;
    const padding = 30; // 增加边距到30px，避免太贴边
    
    // 默认位置放在右下角，但保持足够边距
    const defaultX = Math.max(padding, window.innerWidth - bubbleWidth - padding);
    const defaultY = Math.max(padding, window.innerHeight - bubbleHeight - padding);
    
    return {
      x: defaultX,
      y: defaultY,
    };
  }, []);

  // 优化的位置更新函数
  const updatePosition = useCallback((newX: number, newY: number) => {
    // 边界检测 - 确保气泡完全在视口内
    const bubbleWidth = BUBBLE_WIDTH;

    // X轴边界：左右两边留10px边距
    const maxX = Math.max(0, window.innerWidth - BUBBLE_WIDTH - 10);
    const minX = 10;

    // 计算允许的最大/最小 Y  
    // top = position.y - TOOLBAR_OFFSET  
    // 要保证 top ≥ 0 ⇒ position.y ≥ TOOLBAR_OFFSET
    const minY = TOOLBAR_OFFSET;
    const maxY = window.innerHeight - (BUBBLE_HEIGHT - TOOLBAR_OFFSET);

    const clampedX = Math.max(minX, Math.min(newX, maxX));
    const clampedY = Math.max(minY, Math.min(newY, maxY));

    // 仅在位置变化时更新
    if (
      lastPositionRef.current.x !== clampedX ||
      lastPositionRef.current.y !== clampedY
    ) {
      lastPositionRef.current = { x: clampedX, y: clampedY };
      // 通过状态更新位置
      applyTransform(clampedX, clampedY);
    }
  }, [applyTransform]);

  // 拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (currentMode !== 'bubble') return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false; // 重置拖拽标志

    // 阻止默认行为，防止文本被选中
    e.preventDefault();
    document.body.style.userSelect = 'none';

    const defaultPos = getDefaultPosition();
    const startPos = {
      x: bubblePosition.x || defaultPos.x,
      y: bubblePosition.y || defaultPos.y,
    };

    const startMouse = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = moveEvt.clientX - startMouse.x;
      const deltaY = moveEvt.clientY - startMouse.y;

      // 检测是否产生了实际的拖拽偏移（阈值为5像素）
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDraggedRef.current = true;
      }

      // 使用 requestAnimationFrame 优化性能
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = startPos.x + deltaX;
        const newY = startPos.y + deltaY;

        updatePosition(newX, newY);
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 延迟重置拖拽标志，避免影响后续的点击事件
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
  }, [currentMode, bubblePosition, getDefaultPosition, updatePosition]);

  if (isMobile || !isVisible) {
    return null;
  }

  const handleClick = () => {
    // 如果是气泡模式且刚刚发生了拖拽，不处理点击
    if (currentMode === 'bubble' && hasDraggedRef.current) {
      return;
    }

    if (isModalOpen) {
      // 关闭动画
      setIsModalAnimating(false);
      setTimeout(() => {
        setIsModalOpen(false);
        // 隐藏时初始化为bubble模式
        setCurrentMode('bubble');
        // 隐藏时重置位置到默认位置
        const defaultPos = getDefaultPosition();
        setBubblePosition(defaultPos);
      }, 200);
    } else {
      // 打开动画前，确保气泡模式有正确的位置
      if (currentMode === 'bubble' && bubblePosition.x === 0 && bubblePosition.y === 0) {
        const defaultPos = getDefaultPosition();
        setBubblePosition(defaultPos);
      }
      
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalAnimating(true);
      }, 10);
    }
  };

  const handleClose = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      // 隐藏时初始化为bubble模式
      setCurrentMode('bubble');
      // 隐藏时重置位置到默认位置
      const defaultPos = getDefaultPosition();
      setBubblePosition(defaultPos);
    }, 200);
  };

  const toggleMode = () => {
    const newMode = currentMode === 'fullscreen' ? 'bubble' : 'fullscreen';
    setCurrentMode(newMode);
    
    // 切换到气泡模式时，如果没有保存的位置，使用默认位置
    if (newMode === 'bubble' && bubblePosition.x === 0 && bubblePosition.y === 0) {
      const defaultPos = getDefaultPosition();
      setBubblePosition(defaultPos);
    }
  };

  // 全屏模式的 Modal
  const renderFullscreenModal = () => (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      {/* 内容区域 */}
      <div className={`fixed inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-out ${isModalAnimating
        ? 'opacity-100 scale-100 translate-y-0'
        : 'opacity-0 scale-95 translate-y-4'
        }`}>
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-white text-sm font-bold drop-shadow-md">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-white drop-shadow-sm">ZHQ 的智能助手</h3>
              <p className="text-xs text-blue-100 drop-shadow-sm">随时为您提供帮助 ✨</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMode}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-150"
              title="切换到气泡模式"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-150"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-80px)]">
          <AssistantPopover />
        </div>
      </div>
    </div>
  );

  // 气泡模式的 Modal
  const renderBubbleModal = () => {
    const defaultPos = getDefaultPosition();
    const position = {
      x: bubblePosition.x || defaultPos.x,
      y: bubblePosition.y || defaultPos.y,
    };

    // 使用响应式主题状态
    const isDark = isDarkTheme;

    // 根据主题设置CSS变量 - 使用更明确的颜色值确保可见性
    const cssVariables = {
      '--background': isDark ? '240 10% 3.9%' : '0 0% 100%',
      '--foreground': isDark ? '0 0% 98%' : '240 10% 3.9%',
      '--muted': isDark ? '240 3.7% 15.9%' : '240 4.8% 95.9%',
      '--muted-foreground': isDark ? '240 5% 64.9%' : '240 3.8% 46.1%',
      '--border': isDark ? '240 3.7% 15.9%' : '240 5.9% 90%',
      '--input': isDark ? '240 3.7% 15.9%' : '240 5.9% 90%',
      '--ring': isDark ? '240 4.9% 83.9%' : '240 10% 3.9%',
      '--radius': '0.5rem',
      '--chart-1': '12 76% 61%',
      '--chart-2': '173 58% 39%',
      '--chart-3': '197 37% 24%',
      '--chart-4': '43 74% 66%',
      '--chart-5': '27 87% 67%',
      // 添加更多的颜色变量以确保兼容性
      '--primary': isDark ? '0 0% 98%' : '240 10% 3.9%',
      '--primary-foreground': isDark ? '240 10% 3.9%' : '0 0% 98%',
      '--secondary': isDark ? '240 3.7% 15.9%' : '240 4.8% 95.9%',
      '--secondary-foreground': isDark ? '0 0% 98%' : '240 10% 3.9%',
      '--accent': isDark ? '240 3.7% 15.9%' : '240 4.8% 95.9%',
      '--accent-foreground': isDark ? '0 0% 98%' : '240 10% 3.9%',
      '--card': isDark ? '240 10% 3.9%' : '0 0% 100%',
      '--card-foreground': isDark ? '0 0% 98%' : '240 10% 3.9%',
      '--popover': isDark ? '240 10% 3.9%' : '0 0% 100%',
      '--popover-foreground': isDark ? '0 0% 98%' : '240 10% 3.9%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
    };

    return (
      <div 
        className="fixed z-50"
        data-no-splash="true"
        style={{
          left: `${position.x}px`,
          top: `${position.y - TOOLBAR_OFFSET}px`,
          width: `${BUBBLE_WIDTH}px`,
          height: `${BUBBLE_HEIGHT}px`
        }}
      >
        <div
          ref={bubbleRef}
          className={`
            w-full h-full rounded-xl overflow-hidden
            transition-all duration-200 ease-out
            ${isModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          <ShineBorder
            borderWidth={3}
            borderRadius={12}
            duration={135}
            className="h-full w-full shadow-2xl"
            color={["#FF007F", "#39FF14", "#00FFFF"]}
            style={{
              backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* 顶部工具栏 - 拖拽区域 */}
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 cursor-move"
              onMouseDown={handleMouseDown}
              onClick={(e) => {
                // 如果发生了拖拽，不触发点击事件
                if (hasDraggedRef.current) {
                  e.stopPropagation();
                  return;
                }
              }}
            >
              <div className="flex items-center space-x-3 flex-1">
                {/* 拖拽指示器 */}
                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 opacity-60 hover:opacity-100 transition-opacity" title="拖拽移动">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"></path>
                  </svg>
                </div>
                
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white drop-shadow-sm">ZHQ 的智能助手</h3>
                  <p className="text-xs text-blue-100 drop-shadow-sm">随时为您提供帮助 ✨</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMode();
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                  title="切换到全屏模式"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                  title="关闭"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 内容区域 */}
            <div 
              className="h-[calc(100%-80px)] p-0 relative overflow-hidden"
              style={cssVariables as React.CSSProperties}
            >
              <div className="h-full w-full relative">
                <div 
                  className="h-full w-full"
                  style={{
                    color: isDark ? '#ffffff' : '#000000',
                    backgroundColor: 'transparent'
                  }}
                >
                  <AssistantPopover />
                </div>
              </div>
            </div>
          </ShineBorder>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        currentMode === 'fullscreen' ? renderFullscreenModal() : renderBubbleModal()
      )}

      {/* 机器人按钮 */}
      <div
        className={`
          fixed bottom-8 right-6 z-[60]
          transition-all duration-300 ease-out
          cursor-pointer
          group
          pointer-events-auto
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0'}
          ${isModalOpen ? 'scale-90' : 'scale-100'}
        `}
        data-no-splash="true"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleMode();
        }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {isModalOpen ? (
          <ShineBorder
            borderWidth={3}
            borderRadius={40}
            duration={10}
            className="w-[80px] h-[80px]"
            color={["#FF007F", "#39FF14", "#00FFFF"]}
          >
            <div
              className={`
                relative w-full h-full rounded-full 
                overflow-hidden
                transform transition-all duration-300 ease-out
                ${isHovered
                  ? 'shadow-2xl shadow-blue-500/30 bg-black/30 scale-110'
                  : 'shadow-lg shadow-black/20 scale-100'
                }
              `}
              style={{
                transformOrigin: 'center',
              }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full">
                    <div className="relative">
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <div
                        className="absolute inset-0 w-8 h-8 border-2 border-purple-400 border-b-transparent rounded-full animate-spin"
                        style={{
                          animationDirection: 'reverse',
                          animationDuration: '1.5s'
                        }}
                      />
                    </div>
                  </div>
                }
              >
                <Spline
                  scene="/robot.splinecode"
                  className={`
                    w-full h-full 
                    transition-transform duration-300 ease-out
                    ${isHovered ? 'scale-105' : 'scale-100'}
                  `}
                  style={{
                    pointerEvents: 'auto',
                  }}
                />
              </Suspense>
            </div>
          </ShineBorder>
        ) : (
          <div
            className={`
              relative w-[80px] h-[80px] rounded-full 
              overflow-hidden
              transform transition-all duration-300 ease-out
              ${isHovered
                ? 'shadow-2xl shadow-blue-500/30 bg-black/30 scale-110'
                : 'shadow-lg shadow-black/20 scale-100'
              }
            `}
            style={{
              transformOrigin: 'center',
            }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full">
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <div
                      className="absolute inset-0 w-8 h-8 border-2 border-purple-400 border-b-transparent rounded-full animate-spin"
                      style={{
                        animationDirection: 'reverse',
                        animationDuration: '1.5s'
                      }}
                    />
                  </div>
                </div>
              }
            >
              <Spline
                scene="/robot.splinecode"
                className={`
                  w-full h-full 
                  transition-transform duration-300 ease-out
                  ${isHovered ? 'scale-105' : 'scale-100'}
                `}
                style={{
                  pointerEvents: 'auto',
                }}
              />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingRobot; 