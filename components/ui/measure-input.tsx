'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MeasureInputProps {
  /** Valore corrente */
  value: number;
  /** Callback cambio valore */
  onChange: (value: number) => void;
  /** Valore minimo consentito */
  min?: number;
  /** Valore massimo consentito */
  max?: number;
  /** Step incremento/decremento (default: 10 per mm, 1 per gradi) */
  step?: number;
  /** Unità di misura da visualizzare */
  unit?: string;
  /** Label del campo */
  label?: string;
  /** Mostra indicatori min/max */
  showRange?: boolean;
  /** Dimensione componente */
  size?: 'default' | 'large';
  /** Classe CSS aggiuntiva */
  className?: string;
  /** Disabilitato */
  disabled?: boolean;
}

/**
 * MeasureInput - Input ottimizzato per tablet + pennino
 *
 * Features:
 * - Bottoni +/- grandi per incrementi rapidi
 * - Input leggibile con testo grande
 * - Validazione visuale (rosso se fuori range)
 * - Step personalizzabile
 * - Ottimizzato per uso con pennino in cantiere
 *
 * @example
 * <MeasureInput
 *   value={1200}
 *   onChange={(v) => setLato(v)}
 *   min={300}
 *   max={2500}
 *   step={10}
 *   unit="mm"
 *   label="Lato Base"
 * />
 */
export function MeasureInput({
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 10,
  unit = 'mm',
  label,
  showRange = true,
  size = 'default',
  className,
  disabled = false,
}: MeasureInputProps) {
  const isOutOfRange = value < min || value > max;

  const increment = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
  };

  const buttonSize = size === 'large' ? 'h-14 w-14' : 'h-10 w-10';
  const inputSize = size === 'large' ? 'h-14 text-3xl' : 'h-10 text-xl';
  const labelSize = size === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label className={cn('block font-medium text-gray-300', labelSize)}>
          {label}
        </label>
      )}

      {/* Input Group */}
      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className={cn(
            buttonSize,
            'rounded-lg flex items-center justify-center',
            'bg-dark-blue/50 border-2 border-cyber-cyan/30',
            'text-cyber-cyan font-bold',
            'transition-all duration-300',
            'hover:border-cyber-cyan hover:bg-cyber-cyan/10',
            'hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]',
            'active:scale-95',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cyber-cyan/30',
            // Ottimizzazione touch/pennino
            'touch-manipulation select-none',
            size === 'large' && 'text-2xl'
          )}
          aria-label="Decrementa"
        >
          <Minus className={size === 'large' ? 'w-6 h-6' : 'w-5 h-5'} />
        </button>

        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              inputSize,
              'w-full px-4 rounded-lg text-center',
              'bg-dark-blue/50 border-2',
              'text-white font-mono font-bold',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2',
              // Touch/pennino optimization
              'touch-manipulation',
              // Validation styling
              isOutOfRange
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50 text-red-400'
                : 'border-cyber-cyan/30 focus:border-cyber-cyan focus:ring-cyber-cyan/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />

          {/* Unit Badge */}
          {unit && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-gray-500 font-mono pointer-events-none',
                size === 'large' ? 'text-base' : 'text-sm'
              )}
            >
              {unit}
            </div>
          )}
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= max}
          className={cn(
            buttonSize,
            'rounded-lg flex items-center justify-center',
            'bg-dark-blue/50 border-2 border-cyber-cyan/30',
            'text-cyber-cyan font-bold',
            'transition-all duration-300',
            'hover:border-cyber-cyan hover:bg-cyber-cyan/10',
            'hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]',
            'active:scale-95',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cyber-cyan/30',
            // Ottimizzazione touch/pennino
            'touch-manipulation select-none',
            size === 'large' && 'text-2xl'
          )}
          aria-label="Incrementa"
        >
          <Plus className={size === 'large' ? 'w-6 h-6' : 'w-5 h-5'} />
        </button>
      </div>

      {/* Range Indicator */}
      {showRange && (
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>Min: {min}{unit}</span>
          <span>Max: {max}{unit}</span>
        </div>
      )}

      {/* Validation Error */}
      {isOutOfRange && (
        <p className="text-xs text-red-400 px-1">
          Valore fuori range consentito ({min}-{max} {unit})
        </p>
      )}
    </div>
  );
}

export default MeasureInput;
