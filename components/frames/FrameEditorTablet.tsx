'use client';

import React, { useState, useEffect } from 'react';
import { isValidPolygon, formatPerimeter, formatArea, calculateArea, calculatePerimeter, calculatePoints } from '@/lib/frames/geometry-utils';
import { MeasureInput } from '@/components/ui/measure-input';
import { PresetButtons, PRESET_LATI_COMUNI, PRESET_ANGOLI_COMUNI } from '@/components/ui/preset-buttons';
import { useResponsive } from '@/hooks/use-device-type';
import { Ruler, Maximize2, AlertCircle } from 'lucide-react';

/**
 * FrameEditorTablet - Editor parametrico ottimizzato per tablet + pennino
 *
 * Differenze rispetto al vecchio FrameEditor:
 * - Layout tablet-first (2 colonne su tablet, 1 su mobile, 3 su desktop)
 * - Input grandi con bottoni +/- per uso con pennino
 * - Preset misure comuni per selezione rapida
 * - Statistiche sempre visibili
 * - Validazione real-time con feedback visivo migliorato
 */
interface FrameEditorTabletProps {
  frameConfig: any;
  onChange: (data: any) => void;
}

export default function FrameEditorTablet({ frameConfig, onChange }: FrameEditorTabletProps) {
  const [lati, setLati] = useState(frameConfig.lati);
  const [angoli, setAngoli] = useState(frameConfig.angoli);
  const [validation, setValidation] = useState<{ valid: boolean; error: string | null }>({ valid: true, error: null });
  const { isMobile, isTablet, isDesktop } = useResponsive();

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

  // Determina layout grid basato su device
  const gridLayout = isMobile
    ? 'grid-cols-1'  // Mobile: stack verticale
    : isTablet
    ? 'grid-cols-2'  // Tablet: 2 colonne (TARGET PRIMARIO)
    : 'grid-cols-3'; // Desktop: 3 colonne (Lati | Angoli | Stats)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl tablet:text-4xl font-orbitron font-bold text-cyber-cyan mb-2">
          Definisci Misure
        </h2>
        <p className="text-gray-400 text-sm tablet:text-base">
          {frameConfig.nome} - Personalizza lati e angoli con precisione
        </p>
      </div>

      {/* Validation Banner */}
      {!validation.valid && (
        <div className="
          p-4 rounded-lg border-2 border-red-500/50
          bg-red-500/10 backdrop-blur-md
          text-red-400 text-center
          shadow-[0_0_20px_rgba(239,68,68,0.3)]
          animate-pulse
        ">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Configurazione non valida</span>
          </div>
          <p className="text-sm">{validation.error}</p>
        </div>
      )}

      {/* Statistiche in Alto (sempre visibili su tablet/desktop) */}
      {validation.valid && !isMobile && (
        <div className="
          p-4 tablet:p-6 rounded-lg border-2 border-cyber-cyan/30
          bg-gradient-to-br from-muted-blue/70 to-muted-blue/50
          backdrop-blur-md
          shadow-[0_0_30px_rgba(100,255,218,0.15)]
        ">
          <div className="grid grid-cols-3 gap-4">
            {/* Perimetro */}
            <div className="text-center">
              <Maximize2 className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <div className="text-2xl tablet:text-3xl font-bold text-white mb-1">
                {formatPerimeter(perimetro)}
              </div>
              <div className="text-xs tablet:text-sm text-gray-400">Perimetro</div>
            </div>

            {/* Area */}
            <div className="text-center">
              <Ruler className="w-6 h-6 mx-auto mb-2 text-cyber-cyan" />
              <div className="text-2xl tablet:text-3xl font-bold text-cyber-cyan mb-1">
                {formatArea(area)}
              </div>
              <div className="text-xs tablet:text-sm text-gray-400">Superficie</div>
            </div>

            {/* Numero lati */}
            <div className="text-center">
              <svg className="w-6 h-6 mx-auto mb-2 text-cyber-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="text-2xl tablet:text-3xl font-bold text-cyber-teal mb-1">
                {lati.length}
              </div>
              <div className="text-xs tablet:text-sm text-gray-400">Lati</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Lati | Angoli | (Stats su desktop) */}
      <div className={`grid ${gridLayout} gap-6`}>

        {/* ========== SEZIONE LATI ========== */}
        <div className="
          p-4 tablet:p-6 rounded-lg border-2 border-cyber-cyan/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-cyan/60 transition-all duration-300
        ">
          <h3 className="text-lg tablet:text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
            <Ruler className="w-5 h-5 tablet:w-6 tablet:h-6 text-cyber-cyan" />
            Lati (mm)
          </h3>

          {/* Preset Lati */}
          <PresetButtons
            presets={PRESET_LATI_COMUNI}
            currentValue={lati[0]?.lunghezza}
            onSelect={(value) => handleLatoChange(0, value)}
            label="Misure Standard"
            layout="grid"
            size={isTablet ? 'large' : 'default'}
            className="mb-6"
          />

          {/* Input Lati */}
          <div className="space-y-4">
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
                size={isTablet ? 'large' : 'default'}
              />
            ))}
          </div>
        </div>

        {/* ========== SEZIONE ANGOLI ========== */}
        <div className="
          p-4 tablet:p-6 rounded-lg border-2 border-cyber-teal/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-teal/60 transition-all duration-300
        ">
          <h3 className="text-lg tablet:text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 tablet:w-6 tablet:h-6 text-cyber-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Angoli (°)
          </h3>

          {/* Preset Angoli */}
          <PresetButtons
            presets={PRESET_ANGOLI_COMUNI}
            currentValue={angoli[0]?.gradi}
            onSelect={(value) => handleAngoloChange(0, value)}
            label="Angoli Comuni"
            layout="grid"
            size={isTablet ? 'large' : 'default'}
            className="mb-6"
          />

          {/* Input Angoli */}
          <div className="space-y-4">
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
                size={isTablet ? 'large' : 'default'}
              />
            ))}
          </div>
        </div>

        {/* ========== STATISTICHE (solo desktop in sidebar) ========== */}
        {isDesktop && validation.valid && (
          <div className="
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

      {/* Statistiche Mobile (in basso) */}
      {validation.valid && isMobile && (
        <div className="
          p-4 rounded-lg border-2 border-cyber-cyan/30
          bg-gradient-to-br from-muted-blue/70 to-muted-blue/50
          backdrop-blur-md
          shadow-[0_0_30px_rgba(100,255,218,0.15)]
        ">
          <h3 className="text-base font-orbitron font-bold text-cyber-cyan mb-3 text-center">
            Statistiche
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Perimetro */}
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-1">
                {formatPerimeter(perimetro)}
              </div>
              <div className="text-xs text-gray-400">Perimetro</div>
            </div>

            {/* Area */}
            <div className="text-center">
              <div className="text-xl font-bold text-cyber-cyan mb-1">
                {formatArea(area)}
              </div>
              <div className="text-xs text-gray-400">Superficie</div>
            </div>

            {/* Lati */}
            <div className="text-center">
              <div className="text-xl font-bold text-cyber-teal mb-1">
                {lati.length}
              </div>
              <div className="text-xs text-gray-400">Lati</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
