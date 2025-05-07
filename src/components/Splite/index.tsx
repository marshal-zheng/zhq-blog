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
        <div className="w-full h-full flex items-center justify-center bg-black/[0.96]">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-6">
              {/* 外圈 */}
              <div className="absolute w-24 h-24 rounded-full border-4 border-t-transparent border-l-transparent bg-gradient-to-br from-blue-500 to-purple-600 opacity-30 animate-spin"></div>

              {/* 中圈 */}
              <div className="absolute w-16 h-16 m-4 rounded-full border-4 border-t-transparent border-r-transparent bg-gradient-to-tr from-indigo-400 to-pink-500 opacity-40 animate-reverse"></div>

              {/* 中心点 */}
              <div className="absolute w-8 h-8 m-8 rounded-full bg-gradient-to-b from-white to-blue-300 animate-pulse"></div>
            </div>

            <div className="text-center">
              <div className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                加载3D场景中
              </div>
              <div className="text-xs text-gray-400 mt-2 max-w-xs text-center">
                请稍候，首次加载可能需要一些时间...
              </div>
            </div>
          </div>
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