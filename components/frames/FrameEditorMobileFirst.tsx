'use client';

import React, { useState, useEffect } from 'react';
import { isValidPolygon, formatPerimeter, formatArea, calculateArea, calculatePerimeter, calculatePoints } from '@/lib/frames/geometry-utils';
import { MeasureInput } from '@/components/ui/measure-input';
import { PresetButtons, PRESET_LATI_COMUNI, PRESET_ANGOLI_COMUNI } from '@/components/ui/preset-buttons';
import { Ruler, Maximize2, AlertCircle } from 'lucide-react';

/**
 * FrameEditorMobileFirst - Editor con approccio Mobile-First
 *
 * FILOSOFIA DESIGN:
 * - BASE (mobile): 1 colonna verticale, semplice e pulito
 * - Tablet (md:768px+): 2 colonne (Lati | Angoli)
 * - Desktop (lg:1024px+): 3 colonne (Lati | Angoli | Stats sidebar)
 *
 * Progressive Enhancement: ogni breakpoint AGGIUNGE features, non sottrae
 */
interface FrameEditorMobileFirstProps {
  frameConfig: any;
  onChange: (data: any) => void;
}

export default function FrameEditorMobileFirst({ frameConfig, onChange }: FrameEditorMobileFirstProps) {
  const [lati, setLati] = useState(frameConfig.lati);
  const [angoli, setAngoli] = useState(frameConfig.angoli);
  const [validation, setValidation] = useState<{ valid: boolean; error: string | null }>({ valid: true, error: null });

  // Valida e propaga cambiamenti al parent
  useEffect(() => {
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
  }, [lati, angoli]);

  // Handler cambio lunghezza lato
  const handleLatoChange = (index: number, newValue: number) => {
    const newLati = [...lati];
    newLati[index] = {
      ...newLati[index],
      lunghezza: newValue
    };
    setLati(newLati);
  };

  // Handler cambio angolo
  const handleAngoloChange = (index: number, newValue: number) => {
    const newAngoli = [...angoli];
    newAngoli[index] = {
      ...newAngoli[index],
      gradi: newValue
    };
    setAngoli(newAngoli);
  };

  // Calcola statistiche correnti
  const points = validation.valid ? calculatePoints(lati, angoli) : [];
  const area = validation.valid ? calculateArea(points) : 0;
  const perimetro = calculatePerimeter(lati);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Sempre visibile */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-orbitron font-bold text-cyber-cyan mb-2">
          Definisci Misure
        </h2>
        <p className="text-sm md:text-base text-gray-400">
          {frameConfig.nome} - Personalizza lati e angoli
        </p>
      </div>

      {/* Validation Banner - Solo se errore */}
      {!validation.valid && (
        <div className="
          p-3 md:p-4 rounded-lg border-2 border-red-500/50
          bg-red-500/10 backdrop-blur-md
          text-red-400 text-center
          shadow-[0_0_20px_rgba(239,68,68,0.3)]
          animate-pulse
        ">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-semibold">Configurazione non valida</span>
          </div>
          <p className="text-xs md:text-sm">{validation.error}</p>
        </div>
      )}

      {/* Statistiche - Layout responsivo */}
      {validation.valid && (
        <div className="
          p-4 md:p-6 rounded-lg border-2 border-cyber-cyan/30
          bg-gradient-to-br from-muted-blue/70 to-muted-blue/50
          backdrop-blur-md
          shadow-[0_0_30px_rgba(100,255,218,0.15)]
          lg:hidden
        ">
          {/* Mobile/Tablet: 3 colonne orizzontali */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {/* Perimetro */}
            <div className="text-center">
              <Maximize2 className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-400" />
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-0.5 md:mb-1">
                {formatPerimeter(perimetro)}
              </div>
              <div className="text-xs md:text-sm text-gray-400">Perimetro</div>
            </div>

            {/* Area */}
            <div className="text-center">
              <Ruler className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-cyber-cyan" />
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-cyber-cyan mb-0.5 md:mb-1">
                {formatArea(area)}
              </div>
              <div className="text-xs md:text-sm text-gray-400">Superficie</div>
            </div>

            {/* Numero lati */}
            <div className="text-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-cyber-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-cyber-teal mb-0.5 md:mb-1">
                {lati.length}
              </div>
              <div className="text-xs md:text-sm text-gray-400">Lati</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Mobile-First Progressive Layout */}
      <div className="
        grid grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-4 md:gap-6
      ">

        {/* ========== SEZIONE LATI ========== */}
        <div className="
          p-4 md:p-6 rounded-lg border-2 border-cyber-cyan/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-cyan/60 transition-all duration-300
        ">
          <h3 className="text-base md:text-lg lg:text-xl font-orbitron font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
            <Ruler className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-cyber-cyan" />
            Lati (mm)
          </h3>

          {/* Preset Lati - Scroll orizzontale su mobile */}
          <div className="mb-4 md:mb-6">
            <PresetButtons
              presets={PRESET_LATI_COMUNI}
              currentValue={lati[0]?.lunghezza}
              onSelect={(value) => handleLatoChange(0, value)}
              label="Misure Standard"
              layout="grid"
              size="default"
            />
          </div>

          {/* Input Lati */}
          <div className="space-y-3 md:space-y-4">
            {lati.map((lato: any, index: number) => (
              <MeasureInput
                key={lato.id}
                value={lato.lunghezza}
                onChange={(value) => handleLatoChange(index, value)}
                min={lato.minimo}
                max={lato.massimo}
                step={10}
                unit="mm"
                label={lato.label}
                showRange={true}
                size="default"
              />
            ))}
          </div>
        </div>

        {/* ========== SEZIONE ANGOLI ========== */}
        <div className="
          p-4 md:p-6 rounded-lg border-2 border-cyber-teal/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-teal/60 transition-all duration-300
        ">
          <h3 className="text-base md:text-lg lg:text-xl font-orbitron font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-cyber-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Angoli (°)
          </h3>

          {/* Preset Angoli */}
          <div className="mb-4 md:mb-6">
            <PresetButtons
              presets={PRESET_ANGOLI_COMUNI}
              currentValue={angoli[0]?.gradi}
              onSelect={(value) => handleAngoloChange(0, value)}
              label="Angoli Comuni"
              layout="grid"
              size="default"
            />
          </div>

          {/* Input Angoli */}
          <div className="space-y-3 md:space-y-4">
            {angoli.map((angolo: any, index: number) => (
              <MeasureInput
                key={angolo.id}
                value={angolo.gradi}
                onChange={(value) => handleAngoloChange(index, value)}
                min={angolo.minimo}
                max={angolo.massimo}
                step={1}
                unit="°"
                label={angolo.label}
                showRange={true}
                size="default"
              />
            ))}
          </div>
        </div>

        {/* ========== STATISTICHE SIDEBAR (solo desktop) ========== */}
        {validation.valid && (
          <div className="
            hidden lg:block
            p-6 rounded-lg border-2 border-cyber-cyan/30
            bg-gradient-to-br from-muted-blue/70 to-muted-blue/50
            backdrop-blur-md
            shadow-[0_0_30px_rgba(100,255,218,0.15)]
          ">
            <h3 className="text-lg font-orbitron font-bold text-cyber-cyan mb-4">
              Statistiche
            </h3>

            <div className="space-y-6">
              {/* Perimetro */}
              <div className="text-center p-4 bg-dark-blue/30 rounded-lg">
                <Maximize2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <div className="text-3xl font-bold text-white mb-1">
                  {formatPerimeter(perimetro)}
                </div>
                <div className="text-sm text-gray-400">Perimetro</div>
              </div>

              {/* Area */}
              <div className="text-center p-4 bg-dark-blue/30 rounded-lg">
                <Ruler className="w-8 h-8 mx-auto mb-2 text-cyber-cyan" />
                <div className="text-3xl font-bold text-cyber-cyan mb-1">
                  {formatArea(area)}
                </div>
                <div className="text-sm text-gray-400">Superficie</div>
              </div>

              {/* Lati */}
              <div className="text-center p-4 bg-dark-blue/30 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2 text-cyber-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="text-3xl font-bold text-cyber-teal mb-1">
                  {lati.length}
                </div>
                <div className="text-sm text-gray-400">Lati Totali</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
