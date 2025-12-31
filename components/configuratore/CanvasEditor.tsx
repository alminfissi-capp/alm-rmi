'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import NumpadOverlay from './NumpadOverlay';

interface CanvasEditorProps {
  frameId: string;
  frameNome: string;
  larghezza: number;
  altezza: number;
  onChangeLarghezza: (value: number) => void;
  onChangeAltezza: (value: number) => void;
}

export default function CanvasEditor({
  frameId,
  frameNome,
  larghezza,
  altezza,
  onChangeLarghezza,
  onChangeAltezza,
}: CanvasEditorProps) {
  const [editingDimension, setEditingDimension] = useState<'larghezza' | 'altezza' | null>(null);

  // Handler conferma numpad
  const handleNumpadConfirm = (value: number) => {
    if (editingDimension === 'larghezza') {
      onChangeLarghezza(value);
    } else if (editingDimension === 'altezza') {
      onChangeAltezza(value);
    }
    setEditingDimension(null);
  };

  // Handler annulla numpad
  const handleNumpadCancel = () => {
    setEditingDimension(null);
  };
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // RESPONSIVE SCALING - Mobile first
  // Spazio disponibile (considerando padding e margini per quote)
  const isMobile = viewportSize.width < 640; // sm breakpoint
  const isTablet = viewportSize.width >= 640 && viewportSize.width < 1024; // md breakpoint

  const maxWidth = isMobile
    ? viewportSize.width - 120  // Mobile: -120px per quote
    : isTablet
    ? Math.min(viewportSize.width - 180, 450) // Tablet: max 450px
    : Math.min(viewportSize.width - 220, 550); // Desktop: max 550px

  const maxHeight = isMobile
    ? viewportSize.height - 250 // Mobile: -250px per navbar + header
    : isTablet
    ? Math.min(viewportSize.height - 300, 500) // Tablet: max 500px
    : Math.min(viewportSize.height - 350, 650); // Desktop: max 650px

  // Scala per mantenere proporzioni e fit nel viewport
  const scale = Math.min(maxWidth / larghezza, maxHeight / altezza, 0.4); // Max 0.4 scale
  const svgWidth = Math.max(larghezza * scale, 150); // Min 150px
  const svgHeight = Math.max(altezza * scale, 150); // Min 150px

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-300 p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Canvas centrale - Card shadcn */}
      <Card className="relative bg-transparent border-0 shadow-none">
        {/* LABEL FRAME - Sopra */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-14">
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 text-white rounded-lg shadow-lg text-xs sm:text-sm font-semibold whitespace-nowrap">
            {frameNome}
          </div>
        </div>

        {/* Container SVG con padding per quote */}
        <div className="relative" style={{
          paddingLeft: '80px',
          paddingBottom: '80px',
          paddingTop: '20px',
          paddingRight: '20px'
        }}>
          {/* SVG Telaio */}
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${larghezza} ${altezza}`}
            className="drop-shadow-2xl"
            style={{ display: 'block' }}
          >
            {/* Sfondo telaio */}
            <rect
              x="0"
              y="0"
              width={larghezza}
              height={altezza}
              fill="#e0f2fe"
              stroke="#1e293b"
              strokeWidth="8"
            />

            {/* Rendering frame specifico */}
            {renderFrameGeometry(frameId, larghezza, altezza)}
          </svg>

          {/* MISURA ALTEZZA - Lato sinistro */}
          <div className="absolute left-0 top-0 flex items-center" style={{ height: svgHeight }}>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              {/* Handle superiore */}
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-700 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform" />

              {/* Linea quota */}
              <div className="flex-1 w-0.5 bg-slate-700 min-h-[20px]" />

              {/* Valore altezza editabile */}
              <button
                onClick={() => setEditingDimension('altezza')}
                className={cn(
                  'px-3 py-2 bg-white border-2 rounded-md shadow-lg font-mono font-bold text-base md:text-lg transition-all',
                  'text-gray-900 min-w-[60px] flex items-center justify-center',
                  editingDimension === 'altezza'
                    ? 'border-blue-500 ring-2 ring-blue-300 text-blue-600'
                    : 'border-slate-700 hover:border-blue-400 hover:text-blue-600'
                )}
                style={{ fontSize: '16px', lineHeight: '1.2' }}
              >
                {Math.round(altezza)}
              </button>

              {/* Linea quota */}
              <div className="flex-1 w-0.5 bg-slate-700 min-h-[20px]" />

              {/* Handle inferiore */}
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-700 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* MISURA LARGHEZZA - Sotto */}
          <div className="absolute left-[80px] top-full mt-4 flex justify-center" style={{ width: svgWidth }}>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Handle sinistro */}
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-700 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform" />

              {/* Linea quota */}
              <div className="h-0.5 bg-slate-700 min-w-[20px]" style={{ width: Math.max(svgWidth / 2 - 60, 20) }} />

              {/* Valore larghezza editabile */}
              <button
                onClick={() => setEditingDimension('larghezza')}
                className={cn(
                  'px-3 py-2 bg-white border-2 rounded-md shadow-lg font-mono font-bold text-base md:text-lg transition-all',
                  'text-gray-900 min-w-[60px] flex items-center justify-center',
                  editingDimension === 'larghezza'
                    ? 'border-blue-500 ring-2 ring-blue-300 text-blue-600'
                    : 'border-slate-700 hover:border-blue-400 hover:text-blue-600'
                )}
                style={{ fontSize: '16px', lineHeight: '1.2' }}
              >
                {Math.round(larghezza)}
              </button>

              {/* Linea quota */}
              <div className="h-0.5 bg-slate-700 min-w-[20px]" style={{ width: Math.max(svgWidth / 2 - 60, 20) }} />

              {/* Handle destro */}
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-700 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </Card>

      {/* NUMPAD OVERLAY */}
      <NumpadOverlay
        open={editingDimension !== null}
        initialValue={editingDimension === 'larghezza' ? larghezza : altezza}
        dimension={editingDimension || 'larghezza'}
        onConfirm={handleNumpadConfirm}
        onCancel={handleNumpadCancel}
      />
    </div>
  );
}

/**
 * Renderizza geometria specifica del frame
 */
function renderFrameGeometry(frameId: string, width: number, height: number) {
  switch (frameId) {
    case 'anta_1_fissa':
      // Singola anta fissa - solo vetro interno
      return (
        <rect
          x="20"
          y="20"
          width={width - 40}
          height={height - 40}
          fill="#bae6fd"
          stroke="#475569"
          strokeWidth="2"
        />
      );

    case 'ante_2_battenti':
      // Due ante battenti - divise verticalmente
      const halfWidth = width / 2;
      return (
        <g>
          {/* Anta sinistra */}
          <rect
            x="20"
            y="20"
            width={halfWidth - 30}
            height={height - 40}
            fill="#bae6fd"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Divisore centrale */}
          <line
            x1={halfWidth}
            y1="0"
            x2={halfWidth}
            y2={height}
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Anta destra */}
          <rect
            x={halfWidth + 10}
            y="20"
            width={halfWidth - 30}
            height={height - 40}
            fill="#bae6fd"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Cerchi centrali (punti di interazione) */}
          <circle
            cx={halfWidth / 2}
            cy={height / 2}
            r="30"
            fill="#60a5fa"
            opacity="0.6"
            stroke="#1e40af"
            strokeWidth="2"
          />
          <circle
            cx={halfWidth + halfWidth / 2}
            cy={height / 2}
            r="30"
            fill="#60a5fa"
            opacity="0.6"
            stroke="#1e40af"
            strokeWidth="2"
          />
        </g>
      );

    case 'ante_3_battenti':
      // Tre ante battenti
      const thirdWidth = width / 3;
      return (
        <g>
          {/* Anta 1 */}
          <rect
            x="20"
            y="20"
            width={thirdWidth - 30}
            height={height - 40}
            fill="#bae6fd"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Divisore 1 */}
          <line
            x1={thirdWidth}
            y1="0"
            x2={thirdWidth}
            y2={height}
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Anta 2 */}
          <rect
            x={thirdWidth + 10}
            y="20"
            width={thirdWidth - 20}
            height={height - 40}
            fill="#bae6fd"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Divisore 2 */}
          <line
            x1={thirdWidth * 2}
            y1="0"
            x2={thirdWidth * 2}
            y2={height}
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Anta 3 */}
          <rect
            x={thirdWidth * 2 + 10}
            y="20"
            width={thirdWidth - 30}
            height={height - 40}
            fill="#bae6fd"
            stroke="#475569"
            strokeWidth="2"
          />
        </g>
      );

    default:
      return null;
  }
}
