'use client';

import React, { useState, useEffect } from 'react';
import { isValidPolygon, formatPerimeter, formatArea, calculateArea, calculatePerimeter, calculatePoints } from '@/lib/frames/geometry-utils';
import { MeasureInput } from '@/components/ui/measure-input';
import { PresetButtons, PRESET_LATI_COMUNI } from '@/components/ui/preset-buttons';
import { Ruler, AlertCircle } from 'lucide-react';

/**
 * FrameEditorSimple - Editor semplificato con Base (L) e Altezza (H)
 *
 * Nomenclatura geometrica standard:
 * - L (Base): lunghezza della base del poligono
 * - H (Altezza): altezza del poligono
 *
 * Formule area:
 * - Rettangolo/Parallelogramma: A = L × H
 * - Triangolo: A = (L × H) / 2
 * - Trapezio: A = ((B + b) × H) / 2
 *
 * Semplificazioni:
 * - Solo 2 input: L (Base) e H (Altezza)
 * - Angoli NON editabili (mantiene angoli di default)
 * - Altri lati calcolati automaticamente
 */
interface FrameEditorSimpleProps {
  frameConfig: any;
  onChange: (data: any) => void;
}

export default function FrameEditorSimple({ frameConfig, onChange }: FrameEditorSimpleProps) {
  const [base, setBase] = useState(frameConfig.lati[0]?.lunghezza || 1200);
  const [altezza, setAltezza] = useState(frameConfig.lati[1]?.lunghezza || 1400);
  const [validation, setValidation] = useState<{ valid: boolean; error: string | null }>({ valid: true, error: null });

  // Reinizializza base e altezza quando cambia la forma
  useEffect(() => {
    setBase(frameConfig.lati[0]?.lunghezza || 1200);
    setAltezza(frameConfig.lati[1]?.lunghezza || 1400);
  }, [frameConfig.id]);

  // Aggiorna lati in base a L (Base) e H (Altezza)
  useEffect(() => {
    let lati = [...frameConfig.lati];
    const angoli = [...frameConfig.angoli];

    // NUOVA LOGICA: Se configurazione ante (solo 2 lati), espandi a 4 lati rettangolo
    if (lati.length === 2) {
      // Configurazione ante: crea automaticamente 4 lati da L×H
      lati = [
        { id: 'base', lunghezza: base, label: 'Base', minimo: lati[0]?.minimo || 300, massimo: lati[0]?.massimo || 3000 },
        { id: 'destra', lunghezza: altezza, label: 'Altezza Destra', minimo: lati[1]?.minimo || 300, massimo: lati[1]?.massimo || 3000 },
        { id: 'alto', lunghezza: base, label: 'Alto', minimo: lati[0]?.minimo || 300, massimo: lati[0]?.massimo || 3000 },
        { id: 'sinistra', lunghezza: altezza, label: 'Altezza Sinistra', minimo: lati[1]?.minimo || 300, massimo: lati[1]?.massimo || 3000 }
      ];
    } else {
      // VECCHIA LOGICA: Forme geometriche con 4 lati
      // L (Base) controlla i lati orizzontali opposti
      if (lati[0]) lati[0] = { ...lati[0], lunghezza: base };
      if (lati[2]) lati[2] = { ...lati[2], lunghezza: base }; // Lato opposto (alto)

      // H (Altezza) controlla i lati verticali opposti
      if (lati[1]) lati[1] = { ...lati[1], lunghezza: altezza };
      if (lati[3]) lati[3] = { ...lati[3], lunghezza: altezza }; // Lato opposto (sinistro)
    }

    const validationResult: any = isValidPolygon(lati, angoli);
    setValidation(validationResult);

    if (validationResult.valid) {
      const points = calculatePoints(lati, angoli);
      const area = calculateArea(points);
      const perimetro = calculatePerimeter(lati);

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
        error: validationResult.error
      });
    }
  }, [base, altezza, frameConfig]);

  return (
    <div className="space-y-4">
      {/* Header Compatto */}
      <div className="text-center">
        <h2 className="text-lg font-orbitron font-bold text-cyber-cyan mb-1">
          Misure
        </h2>
        <p className="text-gray-400 text-xs">
          {frameConfig.nome} • Formula: L × H
        </p>
      </div>

      {/* Validation Banner */}
      {!validation.valid && (
        <div className="
          p-3 rounded-lg border-2 border-red-500/50
          bg-red-500/10 backdrop-blur-md
          text-red-400 text-center text-sm
          shadow-[0_0_20px_rgba(239,68,68,0.3)]
          animate-pulse
        ">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">Configurazione non valida</span>
          </div>
          <p className="text-xs">{validation.error}</p>
        </div>
      )}

      {/* Input L e H */}
      <div className="space-y-4">
        <div className="
          p-4 rounded-lg border-2 border-cyber-cyan/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-cyan/60 transition-all duration-300
        ">
          <h3 className="text-sm font-orbitron font-bold text-white mb-3 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-cyber-cyan" />
            Dimensioni Base × Altezza
          </h3>

          {/* Preset Lati */}
          <PresetButtons
            presets={PRESET_LATI_COMUNI}
            currentValue={base}
            onSelect={(value) => setBase(value)}
            label="Misure Rapide Base"
            layout="grid"
            size="default"
            className="mb-4"
          />

          {/* L - Base */}
          <div className="mb-3">
            <MeasureInput
              value={base}
              onChange={(value) => setBase(value)}
              min={frameConfig.lati[0]?.minimo || 300}
              max={frameConfig.lati[0]?.massimo || 2500}
              step={10}
              unit="mm"
              label="L - Base"
              showRange={true}
              size="large"
            />
          </div>

          {/* H - Altezza */}
          <div>
            <MeasureInput
              value={altezza}
              onChange={(value) => setAltezza(value)}
              min={frameConfig.lati[1]?.minimo || 300}
              max={frameConfig.lati[1]?.massimo || 2500}
              step={10}
              unit="mm"
              label="H - Altezza"
              showRange={true}
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
