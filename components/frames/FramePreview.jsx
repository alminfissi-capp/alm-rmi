'use client';

import React, { useMemo, useState } from 'react';
import { calculateBoundingBox } from '@/lib/frames/geometry-utils';
import { Edit3 } from 'lucide-react';

/**
 * Componente per l'anteprima SVG del frame geometrico
 * Rendering dinamico del poligono con dimensioni e angoli
 *
 * INTERATTIVO: mostra solo L (Base) e H (Altezza) - cliccabili per modificare
 */
export default function FramePreview({
  points,
  lati,
  angoli,
  frameConfig,
  onChangeBase,
  onChangeAltezza,
  editable = true
}) {
  const [editingBase, setEditingBase] = useState(false);
  const [editingAltezza, setEditingAltezza] = useState(false);
  const [tempBase, setTempBase] = useState('');
  const [tempAltezza, setTempAltezza] = useState('');

  // Estrai configurazione ante (se presente)
  const divisioni = frameConfig?.divisioni;
  const traversi = frameConfig?.traversi || [];
  const apertura = frameConfig?.apertura;

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

  // Calcola SOLO posizioni per L (Base - lato 0) e H (Altezza - lato 1)
  const baseLabel = useMemo(() => {
    if (scaledPoints.length === 0 || !lati[0]) return null;

    const p1 = scaledPoints[0];
    const p2 = scaledPoints[1];

    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2 + 30, // Sotto il lato
      lunghezza: Math.round(lati[0].lunghezza),
      type: 'base'
    };
  }, [scaledPoints, lati]);

  const altezzaLabel = useMemo(() => {
    if (scaledPoints.length === 0 || !lati[1]) return null;

    const p1 = scaledPoints[1];
    const p2 = scaledPoints[2];

    return {
      x: (p1.x + p2.x) / 2 + 40, // A destra del lato
      y: (p1.y + p2.y) / 2,
      lunghezza: Math.round(lati[1].lunghezza),
      type: 'altezza'
    };
  }, [scaledPoints, lati]);

  // Handler per confermare modifica Base
  const handleConfirmBase = () => {
    const value = parseInt(tempBase);
    if (!isNaN(value) && value > 0 && onChangeBase) {
      onChangeBase(value);
    }
    setEditingBase(false);
    setTempBase('');
  };

  // Handler per confermare modifica Altezza
  const handleConfirmAltezza = () => {
    const value = parseInt(tempAltezza);
    if (!isNaN(value) && value > 0 && onChangeAltezza) {
      onChangeAltezza(value);
    }
    setEditingAltezza(false);
    setTempAltezza('');
  };

  // Handler keypress Enter
  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      if (type === 'base') handleConfirmBase();
      else handleConfirmAltezza();
    } else if (e.key === 'Escape') {
      setEditingBase(false);
      setEditingAltezza(false);
      setTempBase('');
      setTempAltezza('');
    }
  };

  // Calcola divisioni ante per rendering SVG
  const anteDivisions = useMemo(() => {
    if (!divisioni || scaledPoints.length === 0) {
      return { verticali: [], orizzontali: [] };
    }

    const bbox = {
      minX: Math.min(...scaledPoints.map(p => p.x)),
      maxX: Math.max(...scaledPoints.map(p => p.x)),
      minY: Math.min(...scaledPoints.map(p => p.y)),
      maxY: Math.max(...scaledPoints.map(p => p.y))
    };

    const width = bbox.maxX - bbox.minX;
    const height = bbox.maxY - bbox.minY;

    // Divisioni verticali (ante affiancate)
    const verticali = [];
    if (divisioni.verticali > 1) {
      const stepWidth = width / divisioni.verticali;
      for (let i = 1; i < divisioni.verticali; i++) {
        const x = bbox.minX + (stepWidth * i);
        verticali.push({
          x1: x,
          y1: bbox.minY,
          x2: x,
          y2: bbox.maxY
        });
      }
    }

    // Divisioni orizzontali (traverse)
    const orizzontali = [];

    // Traverse da configurazione
    traversi.forEach(traverso => {
      const y = bbox.minY + (height * traverso.posizione);
      orizzontali.push({
        x1: bbox.minX,
        y1: y,
        x2: bbox.maxX,
        y2: y,
        fisso: traverso.fisso
      });
    });

    // Se divisioni.orizzontali > 1 ma nessun traverso definito, dividi equamente
    if (divisioni.orizzontali > 1 && traversi.length === 0) {
      const stepHeight = height / divisioni.orizzontali;
      for (let i = 1; i < divisioni.orizzontali; i++) {
        const y = bbox.minY + (stepHeight * i);
        orizzontali.push({
          x1: bbox.minX,
          y1: y,
          x2: bbox.maxX,
          y2: y,
          fisso: false
        });
      }
    }

    return { verticali, orizzontali, bbox };
  }, [divisioni, traversi, scaledPoints]);

  // Calcola posizioni maniglie per ante battenti
  const maniglie = useMemo(() => {
    if (!divisioni || apertura !== 'battente' || scaledPoints.length === 0) return [];

    const { bbox } = anteDivisions;
    if (!bbox) return [];

    const handles = [];
    const handleSize = 8;
    const offsetX = 15; // Distanza dal bordo
    const midY = (bbox.minY + bbox.maxY) / 2;

    if (divisioni.verticali === 1) {
      // 1 anta: maniglia a destra
      handles.push({
        x: bbox.maxX - offsetX,
        y: midY,
        type: 'battente'
      });
    } else if (divisioni.verticali === 2) {
      // 2 ante: maniglie centrali
      const centerX = (bbox.minX + bbox.maxX) / 2;
      handles.push(
        { x: centerX - 5, y: midY, type: 'battente' },
        { x: centerX + 5, y: midY, type: 'battente' }
      );
    } else if (divisioni.verticali >= 3) {
      // 3+ ante: maniglia ogni anta
      const stepWidth = (bbox.maxX - bbox.minX) / divisioni.verticali;
      for (let i = 0; i < divisioni.verticali; i++) {
        const x = bbox.minX + (stepWidth * i) + (stepWidth / 2);
        handles.push({
          x: x + (i % 2 === 0 ? offsetX/2 : -offsetX/2),
          y: midY,
          type: 'battente'
        });
      }
    }

    return handles;
  }, [divisioni, apertura, anteDivisions, scaledPoints]);

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

          {/* DIVISIONI VERTICALI (ante affiancate) */}
          {anteDivisions.verticali?.map((line, i) => (
            <line
              key={`div-vert-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#64ffda"
              strokeWidth="3"
              strokeDasharray="8 6"
              opacity="0.85"
              filter="url(#glow)"
            />
          ))}

          {/* DIVISIONI ORIZZONTALI (traverse/sopraluce) */}
          {anteDivisions.orizzontali.map((line, i) => (
            <g key={`div-horiz-${i}`}>
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.fisso ? "#4dd0e1" : "#64ffda"}
                strokeWidth={line.fisso ? "3" : "2"}
                strokeDasharray={line.fisso ? "none" : "4 4"}
                opacity={line.fisso ? "0.8" : "0.6"}
                filter="url(#glow)"
              />
              {/* Badge "FISSO" per traverse fisse */}
              {line.fisso && (
                <text
                  x={(line.x1 + line.x2) / 2}
                  y={line.y1 - 8}
                  textAnchor="middle"
                  className="text-[8px] font-mono font-bold"
                  fill="#4dd0e1"
                  opacity="0.7"
                >
                  FISSO
                </text>
              )}
            </g>
          ))}

          {/* MANIGLIE (per ante battenti) */}
          {maniglie.map((handle, i) => (
            <g key={`handle-${i}`}>
              {/* Maniglia rettangolare */}
              <rect
                x={handle.x - 3}
                y={handle.y - 8}
                width="6"
                height="16"
                fill="#64ffda"
                stroke="#4dd0e1"
                strokeWidth="1"
                rx="2"
                opacity="0.8"
              />
              {/* Cerchio decorativo */}
              <circle
                cx={handle.x}
                cy={handle.y}
                r="2"
                fill="#0a0e27"
                opacity="0.8"
              />
            </g>
          ))}

          {/* Indicatore SCORREVOLE (se apertura scorrevole) */}
          {apertura === 'scorrevole' && anteDivisions.bbox && (
            <g>
              {/* Freccia doppia orizzontale */}
              <path
                d={`M ${anteDivisions.bbox.minX + 20} ${anteDivisions.bbox.minY + 15}
                    L ${anteDivisions.bbox.maxX - 20} ${anteDivisions.bbox.minY + 15}`}
                stroke="#4dd0e1"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead-start)"
                opacity="0.6"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 6 3, 0 6" fill="#4dd0e1" />
                </marker>
                <marker
                  id="arrowhead-start"
                  markerWidth="10"
                  markerHeight="10"
                  refX="1"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="6 0, 0 3, 6 6" fill="#4dd0e1" />
                </marker>
              </defs>
              <text
                x={(anteDivisions.bbox.minX + anteDivisions.bbox.maxX) / 2}
                y={anteDivisions.bbox.minY + 10}
                textAnchor="middle"
                className="text-[9px] font-mono font-bold"
                fill="#4dd0e1"
              >
                SCORREVOLE
              </text>
            </g>
          )}

          {/* Label BASE (L) - INTERATTIVA */}
          {baseLabel && (
            <g
              className={editable ? 'cursor-pointer hover:opacity-80' : ''}
              onClick={() => {
                if (editable && !editingBase) {
                  setEditingBase(true);
                  setTempBase(baseLabel.lunghezza.toString());
                }
              }}
            >
              <rect
                x={baseLabel.x - 50}
                y={baseLabel.y - 14}
                width="100"
                height="28"
                fill="rgba(10, 14, 39, 0.95)"
                stroke={editingBase ? '#4dd0e1' : '#64ffda'}
                strokeWidth="2"
                rx="6"
              />
              {editingBase ? (
                <foreignObject
                  x={baseLabel.x - 45}
                  y={baseLabel.y - 12}
                  width="90"
                  height="24"
                >
                  <input
                    type="number"
                    value={tempBase}
                    onChange={(e) => setTempBase(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, 'base')}
                    onBlur={handleConfirmBase}
                    autoFocus
                    className="
                      w-full h-full px-2 text-center
                      bg-dark-blue text-cyber-cyan
                      font-mono font-bold text-sm
                      border-none outline-none rounded
                    "
                  />
                </foreignObject>
              ) : (
                <>
                  <text
                    x={baseLabel.x}
                    y={baseLabel.y - 2}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-semibold"
                    fill="#94a3b8"
                  >
                    L - Base
                  </text>
                  <text
                    x={baseLabel.x}
                    y={baseLabel.y + 10}
                    textAnchor="middle"
                    className="text-sm font-mono font-bold"
                    fill="#64ffda"
                  >
                    {baseLabel.lunghezza}mm
                  </text>
                  {editable && (
                    <text
                      x={baseLabel.x + 38}
                      y={baseLabel.y + 5}
                      className="text-[8px]"
                      fill="#4dd0e1"
                    >
                      ✏
                    </text>
                  )}
                </>
              )}
            </g>
          )}

          {/* Label ALTEZZA (H) - INTERATTIVA */}
          {altezzaLabel && (
            <g
              className={editable ? 'cursor-pointer hover:opacity-80' : ''}
              onClick={() => {
                if (editable && !editingAltezza) {
                  setEditingAltezza(true);
                  setTempAltezza(altezzaLabel.lunghezza.toString());
                }
              }}
            >
              <rect
                x={altezzaLabel.x - 50}
                y={altezzaLabel.y - 14}
                width="100"
                height="28"
                fill="rgba(10, 14, 39, 0.95)"
                stroke={editingAltezza ? '#4dd0e1' : '#64ffda'}
                strokeWidth="2"
                rx="6"
              />
              {editingAltezza ? (
                <foreignObject
                  x={altezzaLabel.x - 45}
                  y={altezzaLabel.y - 12}
                  width="90"
                  height="24"
                >
                  <input
                    type="number"
                    value={tempAltezza}
                    onChange={(e) => setTempAltezza(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, 'altezza')}
                    onBlur={handleConfirmAltezza}
                    autoFocus
                    className="
                      w-full h-full px-2 text-center
                      bg-dark-blue text-cyber-cyan
                      font-mono font-bold text-sm
                      border-none outline-none rounded
                    "
                  />
                </foreignObject>
              ) : (
                <>
                  <text
                    x={altezzaLabel.x}
                    y={altezzaLabel.y - 2}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-semibold"
                    fill="#94a3b8"
                  >
                    H - Altezza
                  </text>
                  <text
                    x={altezzaLabel.x}
                    y={altezzaLabel.y + 10}
                    textAnchor="middle"
                    className="text-sm font-mono font-bold"
                    fill="#64ffda"
                  >
                    {altezzaLabel.lunghezza}mm
                  </text>
                  {editable && (
                    <text
                      x={altezzaLabel.x + 38}
                      y={altezzaLabel.y + 5}
                      className="text-[8px]"
                      fill="#4dd0e1"
                    >
                      ✏
                    </text>
                  )}
                </>
              )}
            </g>
          )}
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

      {/* Legenda e hint interattività */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 rounded border-2 border-cyber-cyan bg-cyber-cyan/10 flex items-center justify-center text-[10px] text-cyber-cyan font-bold">
              L
            </div>
            <span>Base</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 rounded border-2 border-cyber-cyan bg-cyber-cyan/10 flex items-center justify-center text-[10px] text-cyber-cyan font-bold">
              H
            </div>
            <span>Altezza</span>
          </div>
        </div>
        {editable && (
          <div className="text-center text-xs text-cyber-teal/80 flex items-center justify-center gap-2">
            <Edit3 className="w-3 h-3" />
            <span>Clicca sulle misure per modificarle</span>
          </div>
        )}
      </div>
    </div>
  );
}
