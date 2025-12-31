'use client';

import { cn } from '@/lib/utils';

type DeviceType = 'mobile' | 'tablet';

interface DeviceFrameProps {
  width: number;
  height: number;
  deviceName: string;
  deviceType: DeviceType;
  scale: number;
  children: React.ReactNode;
  className?: string;
}

export default function DeviceFrame({
  width,
  height,
  deviceName,
  deviceType,
  scale,
  children,
  className,
}: DeviceFrameProps) {
  const isMobile = deviceType === 'mobile';

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden flex items-start justify-center pt-[10vh] pb-[5vh]">
      {/* Device Frame Container - Stile Menumal con altezza dinamica */}
      <div
        className={cn('relative transition-transform duration-200 flex flex-col', className)}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          maxHeight: '85vh', // Limita l'altezza massima
        }}
      >
        {/* Outer Device Border - Bordo ultra-sottile nero */}
        <div
          className={cn(
            'relative bg-black flex-1 flex flex-col',
            'shadow-2xl',
            isMobile ? 'rounded-[2.5rem]' : 'rounded-[2rem]',
            'p-[8px]' // Bordo ultra-sottile
          )}
          style={{
            width: `${width + 16}px`,
            minHeight: '400px', // Altezza minima
          }}
        >
          {/* Screen Container - Altezza flessibile */}
          <div
            className={cn(
              'relative bg-white overflow-hidden flex-1',
              isMobile ? 'rounded-[2rem]' : 'rounded-[1.5rem]'
            )}
            style={{
              width: `${width}px`,
            }}
          >
            {/* Screen Content - Scrollabile verticalmente */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-white">
              {children}
            </div>
          </div>
        </div>

        {/* Subtle Device Shadow */}
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
