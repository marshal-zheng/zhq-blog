import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  console.log('渲染SplineScene组件，场景URL:', scene);

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="animate-pulse text-gray-400">加载3D场景中...</span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={() => console.log('Spline场景加载成功:', scene)}
        onError={(err) => console.error('Spline场景加载错误:', err)}
      />
    </Suspense>
  )
}