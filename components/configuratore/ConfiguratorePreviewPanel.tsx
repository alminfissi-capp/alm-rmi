'use client';

import { useMemo } from 'react';
import FramePreview from '@/components/frames/FramePreview';
import SaveIndicator from './SaveIndicator';
import { ConfiguratoreState } from '@/hooks/use-configuratore-state';
import type { SaveStatus } from '@/hooks/use-auto-save';
import { Square } from 'lucide-react';

interface ConfiguratorePreviewPanelProps {
  state: ConfiguratoreState;
  onChangeBase?: (value: number) => void;
  onChangeAltezza?: (value: number) => void;
  saveStatus?: SaveStatus;
  lastSavedAt?: Date | null;
  errorMessage?: string | null;
}

export default function ConfiguratorePreviewPanel({
  state,
  onChangeBase,
  onChangeAltezza,
  saveStatus = 'idle',
  lastSavedAt = null,
  errorMessage = null,
}: ConfiguratorePreviewPanelProps) {
  // Calcola punti del poligono da misure
  const points = useMemo(() => {
    if (!state.frameConfig) return [];

    const { larghezza, altezza } = state;

    // Poligono rettangolare standard
    // P0 (0,0) → P1 (L,0) → P2 (L,H) → P3 (0,H)
    return [
      { x: 0, y: 0 },
      { x: larghezza, y: 0 },
      { x: larghezza, y: altezza },
      { x: 0, y: altezza },
    ];
  }, [state.frameConfig, state.larghezza, state.altezza]);

  // Prepara array lati per FramePreview
  const lati = useMemo(() => {
    if (!state.frameConfig) return [];

    return [
      {
        id: 'base',
        lunghezza: state.larghezza,
        label: 'Larghezza (L)',
      },
      {
        id: 'altezza',
        lunghezza: state.altezza,
        label: 'Altezza (H)',
      },
    ];
  }, [state.larghezza, state.altezza, state.frameConfig]);

  // Placeholder se nessun frame selezionato
  if (!state.frameConfig) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-center p-8 bg-gray-50">
        <div>
          <Square className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Seleziona un Frame
          </h3>
          <p className="text-sm text-gray-500">
            Scegli una configurazione dalla sezione sottostante
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="mb-4 space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {state.frameConfig.nome}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {state.frameConfig.descrizione}
          </p>
        </div>

        {/* Save Indicator */}
        <SaveIndicator
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          errorMessage={errorMessage}
        />
      </div>

      {/* Preview SVG */}
      <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <FramePreview
          points={points}
          lati={lati}
          angoli={[]}
          frameConfig={state.frameConfig}
          onChangeBase={onChangeBase}
          onChangeAltezza={onChangeAltezza}
          editable={true}
        />
      </div>

      {/* Stats Footer */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="text-center p-3 rounded-md bg-white border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 mb-1 font-medium">Area</p>
          <p className="text-lg font-semibold text-blue-600">
            {state.area.toFixed(2)} m²
          </p>
        </div>
        <div className="text-center p-3 rounded-md bg-white border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 mb-1 font-medium">Perimetro</p>
          <p className="text-lg font-semibold text-blue-600">
            {state.perimetro.toFixed(2)} ml
          </p>
        </div>
      </div>
    </div>
  );
}
