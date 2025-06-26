import React, { useState, useEffect, Suspense, lazy } from 'react';
import AssistantPopover from './AssistantUI/Modal';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface FloatingRobotProps {
  mode?: 'fullscreen' | 'bubble'; // 全屏模式或气泡模式
}

const FloatingRobot: React.FC<FloatingRobotProps> = ({ mode = 'fullscreen' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    };
  }, []);

  if (isMobile || !isVisible) {
    return null;
  }

  const handleClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 全屏模式的 Modal
  const renderFullscreenModal = () => (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      />

      {/* 内容区域 */}
      <div className="fixed inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <AssistantPopover />
      </div>
    </div>
  );

  // 气泡模式的 Modal
  const renderBubbleModal = () => (
    <div className="fixed bottom-32 right-6 z-50 w-[400px] h-[550px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">AI 助手</h3>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="h-[calc(100%-60px)]">
        <AssistantPopover />
      </div>
    </div>
  );

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        mode === 'fullscreen' ? renderFullscreenModal() : renderBubbleModal()
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