"use client";

import { clsx } from "clsx";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number | [number, number, number, number];
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  enabled?: boolean; // 是否启用边框效果，默认为 true
}

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param enabled controls whether the border effect is enabled, defaults to true
 * @param children contains react node elements.
 */
function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  style,
  children,
  enabled = true,
}: ShineBorderProps) {
  // 处理圆角配置
  const getBorderRadius = () => {
    if (Array.isArray(borderRadius)) {
      const [topLeft, topRight, bottomRight, bottomLeft] = borderRadius;
      return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
    }
    return `${borderRadius}px`;
  };

  // 生成唯一的动画ID
  const animationId = `shine-pulse-${Math.random().toString(36).substr(2, 9)}`;
  
  // 动画关键帧
  const keyframes = `
    @keyframes ${animationId} {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 0%; }
    }
  `;

  const containerStyle = {
    ...style,
    position: 'relative' as const,
    padding: `${borderWidth}px`,
    borderRadius: getBorderRadius(),
    background: 'transparent',
  };

  const beforeStyle = {
    content: '""',
    position: 'absolute' as const,
    inset: 0,
    padding: `${borderWidth}px`,
    background: `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)`,
    backgroundSize: '300% 300%',
    backgroundPosition: '0% 0%',
    animation: `${animationId} ${duration}s infinite`,
    borderRadius: getBorderRadius(), // 使用与容器相同的圆角
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    zIndex: -1,
  };

  return (
    <>
      {enabled && <style>{keyframes}</style>}
      <div
        style={containerStyle}
        className={clsx(className)}
      >
        {enabled && <div style={beforeStyle} />}
        <div 
          className="relative z-10 h-full w-full overflow-hidden"
          style={{
            borderRadius: getBorderRadius(), // 使用与容器相同的圆角，而不是减去边框宽度
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export { ShineBorder }
