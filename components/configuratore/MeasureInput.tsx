'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PresetMeasures from './PresetMeasures';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MeasureInputProps {
  larghezza: number;
  altezza: number;
  frameConfig: any | null;
  onChange: (larghezza: number, altezza: number) => void;
}

export default function MeasureInput({
  larghezza,
  altezza,
  frameConfig,
  onChange,
}: MeasureInputProps) {
  // Estrai limiti da frameConfig
  const latiConfig = frameConfig?.lati || [];
  const baseConfig = latiConfig.find((l: any) => l.id === 'base');
  const altezzaConfig = latiConfig.find((l: any) => l.id === 'altezza');

  const minL = baseConfig?.minimo || 400;
  const maxL = baseConfig?.massimo || 3000;
  const minH = altezzaConfig?.minimo || 600;
  const maxH = altezzaConfig?.massimo || 2800;

  const STEP = 50; // mm

  // Handlers increment/decrement
  const handleIncrement = (type: 'larghezza' | 'altezza') => {
    if (type === 'larghezza') {
      const newVal = Math.min(larghezza + STEP, maxL);
      onChange(newVal, altezza);
    } else {
      const newVal = Math.min(altezza + STEP, maxH);
      onChange(larghezza, newVal);
    }
  };

  const handleDecrement = (type: 'larghezza' | 'altezza') => {
    if (type === 'larghezza') {
      const newVal = Math.max(larghezza - STEP, minL);
      onChange(newVal, altezza);
    } else {
      const newVal = Math.max(altezza - STEP, minH);
      onChange(larghezza, newVal);
    }
  };

  // Handler input diretto
  const handleDirectInput = (value: string, type: 'larghezza' | 'altezza') => {
    const num = parseInt(value);
    if (isNaN(num)) return;

    const min = type === 'larghezza' ? minL : minH;
    const max = type === 'larghezza' ? maxL : maxH;

    if (num < min || num > max) {
      toast.error(
        `${type === 'larghezza' ? 'Larghezza' : 'Altezza'} deve essere tra ${min} e ${max} mm`
      );
      return;
    }

    onChange(type === 'larghezza' ? num : larghezza, type === 'altezza' ? num : altezza);
  };

  return (
    <div className="space-y-6">
      {/* INPUT LARGHEZZA */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Larghezza (L)
        </label>
        <div className="flex items-center gap-3">
          {/* Bottone - */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleDecrement('larghezza')}
            disabled={larghezza <= minL}
            className="h-14 w-14 text-2xl font-bold"
          >
            −
          </Button>

          {/* Input centrale */}
          <div className="flex-1 relative">
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={larghezza}
              onChange={(e) => handleDirectInput(e.target.value, 'larghezza')}
              min={minL}
              max={maxL}
              step={STEP}
              className="h-14 text-center text-xl font-bold pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>

          {/* Bottone + */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleIncrement('larghezza')}
            disabled={larghezza >= maxL}
            className="h-14 w-14 text-2xl font-bold"
          >
            +
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Range consentito: {minL} - {maxL} mm
        </p>
      </div>

      {/* INPUT ALTEZZA */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Altezza (H)
        </label>
        <div className="flex items-center gap-3">
          {/* Bottone - */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleDecrement('altezza')}
            disabled={altezza <= minH}
            className="h-14 w-14 text-2xl font-bold"
          >
            −
          </Button>

          {/* Input centrale */}
          <div className="flex-1 relative">
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={altezza}
              onChange={(e) => handleDirectInput(e.target.value, 'altezza')}
              min={minH}
              max={maxH}
              step={STEP}
              className="h-14 text-center text-xl font-bold pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              mm
            </span>
          </div>

          {/* Bottone + */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleIncrement('altezza')}
            disabled={altezza >= maxH}
            className="h-14 w-14 text-2xl font-bold"
          >
            +
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Range consentito: {minH} - {maxH} mm
        </p>
      </div>

      {/* PRESET MISURE */}
      <PresetMeasures
        onSelect={(preset) => {
          onChange(preset.larghezza, preset.altezza);
          toast.success(`Applicato preset: ${preset.label}`);
        }}
      />
    </div>
  );
}
