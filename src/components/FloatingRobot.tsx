import React, { useState, useEffect, Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const FloatingRobot: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查是否为移动设备
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // 延迟显示，避免页面加载时突兀出现
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      clearTimeout(timer);
    };
  }, []);

  // 移动设备不显示
  if (isMobile || !isVisible) {
    return null;
  }

  const handleClick = () => {
    // 可以在这里添加点击事件，比如打开聊天窗口或跳转到联系页面
    console.log('Robot clicked!');
    // 示例：跳转到关于页面
    window.location.href = '/about';
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[60]
        transition-all duration-300 ease-out
        cursor-pointer
        group
        pointer-events-auto
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
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
      {/* 机器人容器 */}
      <div
        className={`
          relative w-24 h-24 rounded-full 
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
              pointerEvents: 'auto', // 允许Spline组件接收鼠标事件以进行3D交互
            }}
          />
        </Suspense>
      </div>

      {/* 悬停提示 */}
      <div
        className={`
          absolute -bottom-8 left-1/2 transform -translate-x-1/2
          px-2 py-1 bg-black/80 text-white text-xs rounded
          transition-all duration-200 ease-out
          whitespace-nowrap
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        点击了解更多
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/80"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingRobot; 