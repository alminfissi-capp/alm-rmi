'use client';

import { useEffect, useRef, useState } from 'react';
import DxfParser from 'dxf-parser';

export default function DxfViewer({ fileName, className = '' }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileName) return;

    const loadAndRenderDxf = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch del file DXF
        const response = await fetch(`/profili/${fileName}`);
        if (!response.ok) throw new Error('File DXF non trovato');

        const dxfText = await response.text();

        // Parse del DXF
        const parser = new DxfParser();
        const dxf = parser.parseSync(dxfText);

        if (!dxf) throw new Error('Errore parsing DXF');

        // Render su canvas
        renderDxfToCanvas(dxf);
        setLoading(false);
      } catch (err) {
        console.error('Errore caricamento DXF:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadAndRenderDxf();
  }, [fileName]);

  const renderDxfToCanvas = (dxf) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const entities = dxf.entities;

    // Calcola bounds per centrare il disegno
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    entities.forEach(entity => {
      if (entity.type === 'LINE') {
        minX = Math.min(minX, entity.vertices[0].x, entity.vertices[1].x);
        minY = Math.min(minY, entity.vertices[0].y, entity.vertices[1].y);
        maxX = Math.max(maxX, entity.vertices[0].x, entity.vertices[1].x);
        maxY = Math.max(maxY, entity.vertices[0].y, entity.vertices[1].y);
      } else if (entity.type === 'ARC' || entity.type === 'CIRCLE') {
        const r = entity.radius || 0;
        minX = Math.min(minX, entity.center.x - r);
        minY = Math.min(minY, entity.center.y - r);
        maxX = Math.max(maxX, entity.center.x + r);
        maxY = Math.max(maxY, entity.center.y + r);
      }
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.min(canvas.width / width, canvas.height / height) * 0.8;
    const offsetX = (canvas.width - width * scale) / 2 - minX * scale;
    const offsetY = (canvas.height - height * scale) / 2 - minY * scale;

    // Pulisci canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stile cyberpunk
    ctx.strokeStyle = '#64ffda'; // Cyber cyan
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Aggiungi glow
    ctx.shadowColor = '#64ffda';
    ctx.shadowBlur = 8;

    // Renderizza entities
    entities.forEach(entity => {
      ctx.beginPath();

      if (entity.type === 'LINE') {
        const x1 = entity.vertices[0].x * scale + offsetX;
        const y1 = entity.vertices[0].y * scale + offsetY;
        const x2 = entity.vertices[1].x * scale + offsetX;
        const y2 = entity.vertices[1].y * scale + offsetY;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      } else if (entity.type === 'ARC') {
        const cx = entity.center.x * scale + offsetX;
        const cy = entity.center.y * scale + offsetY;
        const r = entity.radius * scale;
        const startAngle = (entity.startAngle || 0) * Math.PI / 180;
        const endAngle = (entity.endAngle || 360) * Math.PI / 180;
        ctx.arc(cx, cy, r, startAngle, endAngle);
      } else if (entity.type === 'CIRCLE') {
        const cx = entity.center.x * scale + offsetX;
        const cy = entity.center.y * scale + offsetY;
        const r = entity.radius * scale;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      }

      ctx.stroke();
    });
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,14,39,0.8)] backdrop-blur-sm rounded-lg">
          <div className="text-[#64ffda] font-orbitron">Caricamento profilo...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,14,39,0.8)] backdrop-blur-sm rounded-lg">
          <div className="text-[#ef4444] font-orbitron text-sm">
            Errore: {error}
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-full rounded-lg bg-[rgba(15,20,40,0.5)] border-2 border-[rgba(100,255,218,0.2)]"
        style={{
          boxShadow: '0 0 20px rgba(100, 255, 218, 0.15), inset 0 0 20px rgba(100, 255, 218, 0.05)'
        }}
      />
    </div>
  );
}
