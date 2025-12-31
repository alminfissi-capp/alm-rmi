'use client';

import { useState, useCallback, useMemo } from 'react';
import { getFrameConfig } from '@/lib/frames/frames-config-complete';
import { toast } from 'sonner';

export interface ConfiguratoreState {
  // Frame selezionato
  frameId: string | null;
  frameConfig: any | null; // FrameConfig type

  // Misure (mm)
  larghezza: number;
  altezza: number;

  // Calcoli derivati (auto-calcolati)
  area: number; // m²
  perimetro: number; // ml

  // Metadata
  lastSaved: Date | null;
  isDirty: boolean;
}

interface UseConfiguratoreStateReturn {
  state: ConfiguratoreState;
  setFrame: (frameId: string) => void;
  setMeasures: (larghezza: number, altezza: number) => void;
  markClean: () => void;
  reset: () => void;
}

export function useConfiguratoreState(
  initialData?: Partial<ConfiguratoreState>
): UseConfiguratoreStateReturn {
  const [state, setState] = useState<ConfiguratoreState>({
    frameId: initialData?.frameId || null,
    frameConfig: initialData?.frameId ? getFrameConfig(initialData.frameId) : null,
    larghezza: initialData?.larghezza || 1000,
    altezza: initialData?.altezza || 1400,
    area: 0,
    perimetro: 0,
    lastSaved: null,
    isDirty: false,
  });

  // Auto-calcolo area e perimetro
  const calculatedState = useMemo(() => {
    const area = (state.larghezza / 1000) * (state.altezza / 1000);
    const perimetro = ((state.larghezza * 2) + (state.altezza * 2)) / 1000;

    return {
      ...state,
      area,
      perimetro,
    };
  }, [state.larghezza, state.altezza, state.frameId, state.frameConfig, state.lastSaved, state.isDirty]);

  // ACTION: Seleziona frame
  const setFrame = useCallback((frameId: string) => {
    const newConfig = getFrameConfig(frameId);
    if (!newConfig) {
      console.error(`Frame ${frameId} non trovato`);
      toast.error('Frame non trovato');
      return;
    }

    // Clamp misure ai nuovi limiti del frame
    const baseConfig = newConfig.lati?.find((l: any) => l.id === 'base');
    const altezzaConfig = newConfig.lati?.find((l: any) => l.id === 'altezza');

    let newLarghezza = state.larghezza;
    let newAltezza = state.altezza;

    if (baseConfig) {
      newLarghezza = Math.max(
        baseConfig.minimo,
        Math.min(baseConfig.massimo, state.larghezza)
      );
    }

    if (altezzaConfig) {
      newAltezza = Math.max(
        altezzaConfig.minimo,
        Math.min(altezzaConfig.massimo, state.altezza)
      );
    }

    setState((prev) => ({
      ...prev,
      frameId,
      frameConfig: newConfig,
      larghezza: newLarghezza,
      altezza: newAltezza,
      isDirty: true,
    }));

    // Warning se misure sono state clampate
    if (newLarghezza !== state.larghezza || newAltezza !== state.altezza) {
      toast.warning('Misure adattate ai limiti del nuovo frame');
    }
  }, [state.larghezza, state.altezza]);

  // ACTION: Aggiorna misure
  const setMeasures = useCallback((larghezza: number, altezza: number) => {
    setState((prev) => ({
      ...prev,
      larghezza,
      altezza,
      isDirty: true,
    }));
  }, []);

  // ACTION: Marca come salvato
  const markClean = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDirty: false,
      lastSaved: new Date(),
    }));
  }, []);

  // ACTION: Reset completo
  const reset = useCallback(() => {
    setState({
      frameId: null,
      frameConfig: null,
      larghezza: 1000,
      altezza: 1400,
      area: 0,
      perimetro: 0,
      lastSaved: null,
      isDirty: false,
    });
  }, []);

  return {
    state: calculatedState,
    setFrame,
    setMeasures,
    markClean,
    reset,
  };
}
