import React, { useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";

interface Spline3DProps {
  scene: string;
  width?: string;
  height?: string;
}

const Spline3D: React.FC<Spline3DProps> = ({
  scene,
  width = "100%",
  height = "400px",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (typeof scene !== 'string') {
      console.error('Spline scene URL must be a string');
      return;
    }

    // 创建Spline应用实例
    appRef.current = new Application(canvasRef.current);

    // 加载场景
    appRef.current.load(scene);

    // 清理函数
    return () => {
      if (appRef.current) {
        appRef.current.dispose();
      }
    };
  }, [scene]);

  return (
    <div className="spline-container my-4" style={{ width, height }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Spline3D; 