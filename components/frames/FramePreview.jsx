'use client';

import React, { useMemo } from 'react';
import { calculateBoundingBox } from '@/lib/frames/geometry-utils';

/**
 * Componente per l'anteprima SVG del frame geometrico
 * Rendering dinamico del poligono con dimensioni e angoli
 */
export default function FramePreview({ points, lati, angoli, frameConfig }) {
  // Calcola bounding box e scaling
  const { scaledPoints, viewBox, scale } = useMemo(() => {
    if (!points || points.length === 0) {
      return { scaledPoints: [], viewBox: '0 0 400 400', scale: 1 };
    }

    const bbox = calculateBoundingBox(points);
    const padding = 60; // Padding per labels
    const viewportSize = 400;

    // Calcola scala per far stare il poligono nel viewport
    const scaleX = (viewportSize - padding * 2) / bbox.width;
    const scaleY = (viewportSize - padding * 2) / bbox.height;
    const scale = Math.min(scaleX, scaleY, 1); // Max 1:1 se è piccolo

    // Trasla e scala i punti
    const scaledPoints = points.map(p => ({
      x: (p.x - bbox.minX) * scale + padding,
      y: (p.y - bbox.minY) * scale + padding
    }));

    return {
      scaledPoints,
      viewBox: `0 0 ${viewportSize} ${viewportSize}`,
      scale
    };
  }, [points]);

  // Genera path string per SVG
  const pathString = useMemo(() => {
    if (scaledPoints.length === 0) return '';

    const path = scaledPoints.map((p, i) =>
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ') + ' Z';

    return path;
  }, [scaledPoints]);

  // Calcola punti medi dei lati per posizionare le label
  const latoLabels = useMemo(() => {
    if (scaledPoints.length === 0) return [];

    return lati.map((lato, i) => {
      const p1 = scaledPoints[i];
      const p2 = scaledPoints[(i + 1) % scaledPoints.length];

      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        label: lato.label,
        lunghezza: Math.round(lato.lunghezza)
      };
    });
  }, [scaledPoints, lati]);

  // Posiziona le label degli angoli
  const angoloLabels = useMemo(() => {
    if (scaledPoints.length === 0) return [];

    return angoli.map((angolo, i) => {
      const p = scaledPoints[i];

      return {
        x: p.x,
        y: p.y,
        label: angolo.label,
        gradi: Math.round(angolo.gradi)
      };
    });
  }, [scaledPoints, angoli]);

  if (!points || points.length === 0) {
    return (
      <div className="
        flex items-center justify-center h-full
        text-gray-500 text-center p-8
      ">
        <div>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p>Anteprima non disponibile</p>
          <p className="text-sm mt-2">Verifica i parametri del frame</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-orbitron font-bold text-cyber-cyan mb-1">
          Anteprima Frame
        </h3>
        <p className="text-sm text-gray-400">
          {frameConfig.nome} - Rendering Real-time
        </p>
      </div>

      {/* SVG Canvas */}
      <div className="
        relative
        bg-gradient-to-br from-dark-blue/80 to-dark-blue/60
        rounded-lg border-2 border-cyber-cyan/30
        p-6
        backdrop-blur-md
        shadow-[0_0_30px_rgba(100,255,218,0.15)]
      ">
        <svg
          viewBox={viewBox}
          className="w-full h-auto"
          style={{ minHeight: '400px' }}
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(100, 255, 218, 0.05)"
                strokeWidth="0.5"
              />
            </pattern>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          <rect width="400" height="400" fill="url(#grid)" />

          {/* Poligono principale */}
          <path
            d={pathString}
            fill="rgba(100, 255, 218, 0.08)"
            stroke="#64ffda"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Vertici */}
          {scaledPoints.map((point, i) => (
            <circle
              key={`vertex-${i}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#64ffda"
              stroke="#4dd0e1"
              strokeWidth="2"
              filter="url(#glow)"
            />
          ))}

          {/* Labels lati */}
          {latoLabels.map((label, i) => (
            <g key={`lato-label-${i}`}>
              <rect
                x={label.x - 35}
                y={label.y - 12}
                width="70"
                height="24"
                fill="rgba(10, 14, 39, 0.9)"
                stroke="#64ffda"
                strokeWidth="1"
                rx="4"
              />
              <text
                x={label.x}
                y={label.y + 5}
                textAnchor="middle"
                className="text-xs font-mono font-bold"
                fill="#64ffda"
              >
                {label.lunghezza}mm
              </text>
            </g>
          ))}

          {/* Labels angoli */}
          {angoloLabels.map((label, i) => (
            <g key={`angolo-label-${i}`}>
              <circle
                cx={label.x}
                cy={label.y}
                r="18"
                fill="rgba(10, 14, 39, 0.9)"
                stroke="#4dd0e1"
                strokeWidth="1.5"
              />
              <text
                x={label.x}
                y={label.y + 4}
                textAnchor="middle"
                className="text-xs font-mono font-bold"
                fill="#4dd0e1"
              >
                {label.gradi}°
              </text>
            </g>
          ))}
        </svg>

        {/* Scala indicator */}
        <div className="
          absolute bottom-2 right-2
          px-3 py-1 rounded-full
          bg-dark-blue/90 border border-cyber-cyan/30
          text-xs text-gray-400
        ">
          Scala: {(scale * 100).toFixed(0)}%
        </div>
      </div>

      {/* Legenda */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-8 h-1 bg-cyber-cyan rounded shadow-[0_0_8px_rgba(100,255,218,0.6)]" />
          <span>Lati (mm)</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-4 h-4 rounded-full border-2 border-cyber-teal bg-cyber-teal/20" />
          <span>Angoli (°)</span>
        </div>
      </div>
    </div>
  );
}
