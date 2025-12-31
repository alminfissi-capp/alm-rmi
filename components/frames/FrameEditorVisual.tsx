'use client';

import React, { useState, useEffect, useRef } from 'react';
import { isValidPolygon, calculatePoints, calculateArea, calculatePerimeter, mm2ToM2 } from '@/lib/frames/geometry-utils';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

/**
 * FrameEditorVisual - Editor ispirato a PVC Windows Studio
 *
 * LAYOUT:
 * - Anteprima GIGANTE al centro (80% schermo)
 * - Misure sovrapposte direttamente sull'anteprima (label bianche)
 * - Handle draggable (punti blu) per resize visuale
 * - Bottom sheet con tabella info tecnica
 * - Design clean e minimal
 */

interface FrameEditorVisualProps {
  frameConfig: any;
  onChange: (data: any) => void;
}

export default function FrameEditorVisual({ frameConfig, onChange }: FrameEditorVisualProps) {
  const [lati, setLati] = useState(frameConfig.lati);
  const [angoli, setAngoli] = useState(frameConfig.angoli);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<'lato' | 'angolo' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(true);
  const [draggingHandle, setDraggingHandle] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calcola geometria corrente
  const validation: any = isValidPolygon(lati, angoli);
  const points = validation.valid ? calculatePoints(lati, angoli) : [];
  const area = validation.valid ? calculateArea(points) : 0;
  const perimetro = calculatePerimeter(lati);

  // Propaga cambiamenti al parent
  useEffect(() => {
    if (validation.valid) {
      onChange({
        lati,
        angoli,
        points,
        area,
        perimetro,
        valid: true
      });
    } else {
      onChange({
        lati,
        angoli,
        valid: false,
        error: validation.error
      });
    }
  }, [lati, angoli]);

  // Handler modifica lato
  const handleLatoChange = (index: number, newValue: number) => {
    const newLati = [...lati];
    newLati[index] = {
      ...newLati[index],
      lunghezza: newValue
    };
    setLati(newLati);
  };

  // Handler modifica angolo
  const handleAngoloChange = (index: number, newValue: number) => {
    const newAngoli = [...angoli];
    newAngoli[index] = {
      ...newAngoli[index],
      gradi: newValue
    };
    setAngoli(newAngoli);
  };

  // Inizia editing
  const startEditing = (index: number, type: 'lato' | 'angolo', currentValue: number) => {
    setEditingIndex(index);
    setEditingType(type);
    setTempValue(String(currentValue));
  };

  // Conferma editing
  const confirmEditing = () => {
    if (editingIndex === null || editingType === null) return;

    const value = parseFloat(tempValue);
    if (isNaN(value)) {
      cancelEditing();
      return;
    }

    if (editingType === 'lato') {
      handleLatoChange(editingIndex, value);
    } else {
      handleAngoloChange(editingIndex, value);
    }

    cancelEditing();
  };

  // Annulla editing
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingType(null);
    setTempValue('');
  };

  // Calcola bounds per SVG
  const getBounds = () => {
    if (points.length === 0) return { minX: 0, minY: 0, maxX: 1200, maxY: 1400, width: 1200, height: 1400 };

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const bounds = getBounds();
  const padding = 100; // Padding per label e handle
  const viewBoxWidth = bounds.width + padding * 2;
  const viewBoxHeight = bounds.height + padding * 2;

  // Converti punti in path SVG
  const pathData = points.length > 0
    ? `M ${points.map(p => `${p.x - bounds.minX + padding},${p.y - bounds.minY + padding}`).join(' L ')} Z`
    : '';

  // Calcola posizioni label misure (al centro di ogni lato)
  const getMeasurePositions = () => {
    if (points.length === 0) return [];

    return lati.map((lato: any, index: number) => {
      const p1 = points[index];
      const p2 = points[(index + 1) % points.length];

      const midX = (p1.x + p2.x) / 2 - bounds.minX + padding;
      const midY = (p1.y + p2.y) / 2 - bounds.minY + padding;

      // Calcola normale per spostare label all'esterno
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const normalX = -dy / length;
      const normalY = dx / length;

      return {
        x: midX + normalX * 40,
        y: midY + normalY * 40,
        value: lato.lunghezza,
        label: lato.label || `L${index + 1}`,
        isHorizontal: Math.abs(dy) < Math.abs(dx)
      };
    });
  };

  const measurePositions = getMeasurePositions();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* MAIN PREVIEW - Occupa tutto lo spazio disponibile */}
      <div className="flex-1 relative overflow-hidden">
        {/* SVG Preview Gigante */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full"
          style={{ maxHeight: 'calc(100vh - 250px)' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#grid)" />

          {/* Frame poligono */}
          {pathData && (
            <>
              {/* Ombra */}
              <path
                d={pathData}
                fill="rgba(0,0,0,0.1)"
                transform="translate(5, 5)"
                filter="blur(10px)"
              />

              {/* Telaio */}
              <path
                d={pathData}
                fill="#e3f2fd"
                stroke="#1976d2"
                strokeWidth="8"
                className="transition-all duration-300"
              />

              {/* Vetro interno */}
              <path
                d={pathData}
                fill="url(#glassGradient)"
                opacity="0.6"
                transform="translate(0, 0) scale(0.9)"
                style={{ transformOrigin: 'center' }}
              />
            </>
          )}

          {/* Gradient vetro */}
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bbdefb" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#90caf9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#64b5f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Handle draggable (punti blu) */}
          {points.map((point, index) => (
            <circle
              key={`handle-${index}`}
              cx={point.x - bounds.minX + padding}
              cy={point.y - bounds.minY + padding}
              r="8"
              fill="#2196f3"
              stroke="white"
              strokeWidth="2"
              className="cursor-move hover:r-10 transition-all"
              onMouseDown={() => setDraggingHandle(index)}
            />
          ))}

          {/* Label misure (stile PVC Windows Studio) */}
          {measurePositions.map((pos, index) => {
            const isEditing = editingIndex === index && editingType === 'lato';

            return (
              <g key={`measure-${index}`}>
                {/* Box bianco */}
                <rect
                  x={pos.x - 35}
                  y={pos.y - 15}
                  width="70"
                  height="30"
                  fill="white"
                  stroke="#1976d2"
                  strokeWidth="2"
                  rx="4"
                  className="cursor-pointer hover:fill-blue-50 transition-colors"
                  onClick={() => !isEditing && startEditing(index, 'lato', pos.value)}
                />

                {/* Valore */}
                {!isEditing ? (
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-800 select-none cursor-pointer"
                    onClick={() => startEditing(index, 'lato', pos.value)}
                  >
                    {pos.value}
                  </text>
                ) : (
                  <foreignObject x={pos.x - 30} y={pos.y - 12} width="60" height="24">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      onBlur={confirmEditing}
                      autoFocus
                      className="w-full h-full text-center text-xs font-bold border-none outline-none bg-transparent"
                    />
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        {/* Validation Error Overlay */}
        {!validation.valid && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
            ⚠️ {validation.error}
          </div>
        )}
      </div>

      {/* BOTTOM SHEET - Tabella info tecnica */}
      <div className="bg-white border-t-2 border-gray-200 shadow-lg">
        {/* Header bottom sheet */}
        <div
          className="flex items-center justify-between px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => setShowBottomSheet(!showBottomSheet)}
        >
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
            <span>Superficie: {mm2ToM2(area).toFixed(2)} m²</span>
            <span>Perimetro: {(perimetro / 1000).toFixed(2)} m</span>
            <span>Lati: {lati.length}</span>
          </div>
          {showBottomSheet ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>

        {/* Tabella dettagli (collapsabile) */}
        {showBottomSheet && (
          <div className="overflow-x-auto px-4 py-3">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="border border-gray-300 px-2 py-1 text-left">Lato</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Lunghezza (mm)</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Angolo</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Gradi (°)</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Min</th>
                  <th className="border border-gray-300 px-2 py-1 text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                {lati.map((lato: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-semibold">{lato.label}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      <span
                        className="cursor-pointer hover:text-blue-600 font-bold"
                        onClick={() => startEditing(index, 'lato', lato.lunghezza)}
                      >
                        {lato.lunghezza}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 font-semibold">
                      {angoli[index]?.label || `A${index + 1}`}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      <span
                        className="cursor-pointer hover:text-blue-600 font-bold"
                        onClick={() => startEditing(index, 'angolo', angoli[index]?.gradi || 90)}
                      >
                        {angoli[index]?.gradi || 90}°
                      </span>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right text-gray-500">
                      {lato.minimo}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right text-gray-500">
                      {lato.massimo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
