import { SplineScene } from "./index";
import { Card } from "./Card"
import { Spotlight } from "./spotlight"
import { useEffect, useState } from "react";

export function SplineSceneBasic() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
      {isMobile && (
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
      )}

      <div className="flex h-full">
        {/* Left content */}
        <div className="absolute top-4 left-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            ZHQ(hanken)
          </h1>
        </div>

        {/* <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
          </p>
        </div> */}

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene
            scene="/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}