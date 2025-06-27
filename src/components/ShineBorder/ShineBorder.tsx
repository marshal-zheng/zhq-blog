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
}

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
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
}: ShineBorderProps) {
  // 处理圆角配置
  const getBorderRadius = () => {
    if (Array.isArray(borderRadius)) {
      const [topLeft, topRight, bottomRight, bottomLeft] = borderRadius;
      return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
    }
    return `${borderRadius}px`;
  };

  return (
    <div
      style={{
        ...style,
        "--border-radius": getBorderRadius(),
        "--border-width": `${borderWidth}px`,
        "--shine-pulse-duration": `${duration}s`,
        "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        "--background-radial-gradient": `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)`,
        borderRadius: getBorderRadius(),
      } as React.CSSProperties}
      className={clsx(
        "relative h-full w-full bg-transparent p-0 shine-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { ShineBorder }
