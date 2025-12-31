'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PresetOption {
  /** Valore del preset */
  value: number;
  /** Label da visualizzare (es. "80cm", "Standard") */
  label: string;
  /** Descrizione opzionale tooltip */
  description?: string;
}

export interface PresetButtonsProps {
  /** Array di preset disponibili */
  presets: PresetOption[];
  /** Valore attualmente selezionato */
  currentValue?: number;
  /** Callback quando si seleziona un preset */
  onSelect: (value: number) => void;
  /** Label del gruppo */
  label?: string;
  /** Layout dei bottoni */
  layout?: 'horizontal' | 'grid';
  /** Dimensione bottoni */
  size?: 'default' | 'large';
  /** Classe CSS aggiuntiva */
  className?: string;
}

/**
 * PresetButtons - Selezione rapida misure comuni
 *
 * Permette di selezionare velocemente misure standard
 * Ottimizzato per tablet + pennino con bottoni grandi
 *
 * @example
 * <PresetButtons
 *   presets={[
 *     { value: 800, label: '80cm' },
 *     { value: 1000, label: '100cm' },
 *     { value: 1200, label: '120cm' },
 *   ]}
 *   currentValue={1000}
 *   onSelect={(v) => setLato(v)}
 *   label="Misure Standard"
 * />
 */
export function PresetButtons({
  presets,
  currentValue,
  onSelect,
  label,
  layout = 'horizontal',
  size = 'default',
  className,
}: PresetButtonsProps) {
  const buttonSize = size === 'large' ? 'h-12 px-6 text-base' : 'h-10 px-4 text-sm';

  const gridClass = layout === 'grid'
    ? 'grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-2'
    : 'flex flex-wrap gap-2';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}

      {/* Preset Buttons */}
      <div className={gridClass}>
        {presets.map((preset) => {
          const isSelected = currentValue === preset.value;

          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onSelect(preset.value)}
              title={preset.description}
              className={cn(
                buttonSize,
                'rounded-lg font-medium',
                'border-2 transition-all duration-300',
                'hover:scale-105 active:scale-95',
                // Touch/pennino optimization
                'touch-manipulation select-none',
                // Selected state
                isSelected
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_20px_rgba(100,255,218,0.4)]'
                  : 'bg-dark-blue/30 border-cyber-cyan/30 text-gray-300 hover:border-cyber-cyan/60 hover:text-white'
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Preset comuni per infissi standard (in mm)
 */
export const PRESET_LATI_COMUNI: PresetOption[] = [
  { value: 600, label: '60cm', description: 'Finestra bagno' },
  { value: 800, label: '80cm', description: 'Finestra standard' },
  { value: 1000, label: '100cm', description: 'Finestra media' },
  { value: 1200, label: '120cm', description: 'Finestra grande' },
  { value: 1400, label: '140cm', description: 'Porta-finestra' },
  { value: 1600, label: '160cm', description: 'Porta-finestra grande' },
];

/**
 * Preset comuni per angoli (in gradi)
 */
export const PRESET_ANGOLI_COMUNI: PresetOption[] = [
  { value: 45, label: '45°', description: 'Angolo inclinato' },
  { value: 60, label: '60°', description: 'Mansarda standard' },
  { value: 90, label: '90°', description: 'Angolo retto' },
  { value: 120, label: '120°', description: 'Esagono' },
  { value: 135, label: '135°', description: 'Ottagono' },
];

export default PresetButtons;
