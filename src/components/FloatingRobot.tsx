import React, { useState, useEffect, Suspense, lazy, useRef, useCallback } from 'react';
import AssistantPopover from './AssistantUI/Modal';
import { ShineBorder } from './ShineBorder/ShineBorder';

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

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 获取默认位置
  const getDefaultPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return {
      x: window.innerWidth - 430 - 24,
      y: window.innerHeight - 550 - 128,
    };
  }, []);

  // 优化的位置更新函数
  const updatePosition = useCallback((newX: number, newY: number) => {
    // 边界检测
    const maxX = window.innerWidth - 430;
    const maxY = window.innerHeight - 550;

    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));

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
    if (isModalOpen) {
      // 关闭动画
      setIsModalAnimating(false);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 200);
    } else {
      // 打开动画
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
    }, 200);
  };

  const toggleMode = () => {
    setCurrentMode(currentMode === 'fullscreen' ? 'bubble' : 'fullscreen');
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
    const currentPos = {
      x: bubblePosition.x || defaultPos.x,
      y: bubblePosition.y || defaultPos.y,
    };

    return (
      <div
        className={`fixed z-50 w-[430px] h-[550px] transition-all duration-200 ease-out transform-gpu ${isModalAnimating
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-4'
          }`}
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        <ShineBorder
          borderRadius={[12, 12, 12, 12]}
          borderWidth={2}
          duration={8}
          color={["#3b82f6", "#8b5cf6", "#ec4899"]}
          className="w-full h-full"
        >
          <div
            ref={bubbleRef}
            className="flex flex-col w-full h-full bg-skin-fill shadow-xl overflow-hidden"
            style={{
              borderRadius: '12px',
            }}
          >
            <div
              className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 cursor-move select-none"
              onMouseDown={handleMouseDown}
              onClick={(e) => {
                // 只有在没有拖拽时才处理点击事件
                if (!hasDraggedRef.current) {
                  e.stopPropagation();
                  // 可以在这里添加点击标题栏的逻辑，比如显示信息等
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30 animate-pulse">
                  <span className="text-white text-sm font-bold drop-shadow-md">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white drop-shadow-sm">ZHQ 的智能助手</h3>
                  <p className="text-xs text-blue-100 drop-shadow-sm">随时为您服务 🚀</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleMode}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-150"
                  title="切换到全屏模式"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-150"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <AssistantPopover />
            </div>
          </div>
        </ShineBorder>
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
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className={`
            relative w-[80px] h-[80px] rounded-full 
            overflow-hidden
            transform transition-all duration-300 ease-out
            ${isHovered
              ? 'shadow-2xl shadow-blue-500/30 bg-black/30 scale-110'
              : 'shadow-lg shadow-black/20 scale-100'
            }
            ${isModalOpen ? 'ring-4 ring-blue-400/50' : ''}
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
      </div>
    </>
  );
};

export default FloatingRobot; 