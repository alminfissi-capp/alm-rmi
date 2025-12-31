'use client';

import { Button } from '@/components/ui/button';

const COMMON_PRESETS = [
  { label: '800×1200', larghezza: 800, altezza: 1200 },
  { label: '1000×1400', larghezza: 1000, altezza: 1400 },
  { label: '1200×1500', larghezza: 1200, altezza: 1500 },
  { label: '1400×1600', larghezza: 1400, altezza: 1600 },
  { label: '1600×2100', larghezza: 1600, altezza: 2100 },
  { label: '2000×2200', larghezza: 2000, altezza: 2200 },
];

interface PresetMeasuresProps {
  onSelect: (preset: { label: string; larghezza: number; altezza: number }) => void;
}

export default function PresetMeasures({ onSelect }: PresetMeasuresProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        Misure Predefinite
      </label>
      <div className="grid grid-cols-3 gap-2">
        {COMMON_PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="secondary"
            size="sm"
            onClick={() => onSelect(preset)}
            className="h-12 text-sm font-mono"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Click per applicare misura standard
      </p>
    </div>
  );
}
