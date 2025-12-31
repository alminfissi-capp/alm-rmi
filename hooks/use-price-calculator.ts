/**
 * ============================================
 * HOOK: usePriceCalculator
 * ============================================
 *
 * Hook React per calcolo prezzi real-time nel configuratore
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  FrameCalcoloConfig,
  MaterialiAggiuntivi,
  CalcoloPrezzoResult
} from '@/lib/pricing/calculate-price';

interface UsePriceCalculatorOptions {
  userId: string;
  prezzarioId?: string;
  autoCalcola?: boolean; // Se true, calcola automaticamente ad ogni cambio
  debounceMs?: number; // Ritardo prima di ricalcolare (default 500ms)
}

interface UsePriceCalculatorReturn {
  // Stato calcolo
  calcolo: CalcoloPrezzoResult | null;
  loading: boolean;
  error: string | null;

  // Funzioni
  calcolaPrezzo: (config: FrameCalcoloConfig, materiali?: MaterialiAggiuntivi) => Promise<void>;
  reset: () => void;
  salvaPreventivo: (rilievoId?: string, cliente?: string, note?: string) => Promise<{ success: boolean; numero?: string }>;

  // Utility
  formattaPrezzo: (importo: number) => string;
  formattaArea: (area: number) => string;
  formattaPerimetro: (perimetro: number) => string;
}

/**
 * Hook principale per calcolo prezzi
 */
export function usePriceCalculator(options: UsePriceCalculatorOptions): UsePriceCalculatorReturn {
  const { userId, prezzarioId, autoCalcola = true, debounceMs = 500 } = options;

  const [calcolo, setCalcolo] = useState<CalcoloPrezzoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcola prezzo chiamando API
   */
  const calcolaPrezzo = useCallback(async (
    config: FrameCalcoloConfig,
    materiali?: MaterialiAggiuntivi
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          userId,
          materiali,
          prezzarioId
        })
      });

      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }

      const result: CalcoloPrezzoResult = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Errore calcolo prezzi');
      }

      setCalcolo(result);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      console.error('Errore calcolo prezzo:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, prezzarioId]);

  /**
   * Reset calcolo
   */
  const reset = useCallback(() => {
    setCalcolo(null);
    setError(null);
  }, []);

  /**
   * Salva preventivo nel database
   */
  const salvaPreventivo = useCallback(async (
    rilievoId?: string,
    cliente?: string,
    note?: string
  ): Promise<{ success: boolean; numero?: string }> => {
    if (!calcolo) {
      return { success: false };
    }

    try {
      const response = await fetch('/api/pricing/save-preventivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calcolo,
          userId,
          rilievoId,
          cliente,
          note
        })
      });

      if (!response.ok) {
        throw new Error(`Errore ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (err) {
      console.error('Errore salvataggio preventivo:', err);
      return { success: false };
    }
  }, [calcolo, userId]);

  /**
   * Formatta prezzo in € con 2 decimali
   */
  const formattaPrezzo = useCallback((importo: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(importo);
  }, []);

  /**
   * Formatta area in m²
   */
  const formattaArea = useCallback((area: number): string => {
    return `${area.toFixed(2)} m²`;
  }, []);

  /**
   * Formatta perimetro in ml
   */
  const formattaPerimetro = useCallback((perimetro: number): string => {
    return `${perimetro.toFixed(2)} ml`;
  }, []);

  return {
    calcolo,
    loading,
    error,
    calcolaPrezzo,
    reset,
    salvaPreventivo,
    formattaPrezzo,
    formattaArea,
    formattaPerimetro
  };
}

/**
 * Hook semplificato per calcolo automatico
 * Ricalcola automaticamente quando cambiano larghezza/altezza
 */
export function useAutoPriceCalculator(
  frameId: string,
  larghezza: number,
  altezza: number,
  userId: string,
  options?: {
    n_ante?: number;
    tipo_apertura?: string;
    materiali?: MaterialiAggiuntivi;
    prezzarioId?: string;
    enabled?: boolean;
  }
) {
  const calculator = usePriceCalculator({
    userId,
    prezzarioId: options?.prezzarioId,
    autoCalcola: true,
    debounceMs: 500
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip se disabilitato o misure non valide
    if (options?.enabled === false || !frameId || larghezza <= 0 || altezza <= 0) {
      return;
    }

    // Cancella timer precedente
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Imposta nuovo timer per debounce
    const timer = setTimeout(() => {
      const config: FrameCalcoloConfig = {
        frame_id: frameId,
        frame_nome: frameId,
        larghezza,
        altezza,
        n_ante: options?.n_ante,
        tipo_apertura: options?.tipo_apertura
      };

      calculator.calcolaPrezzo(config, options?.materiali);
    }, 500);

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [frameId, larghezza, altezza, options?.n_ante, options?.tipo_apertura, options?.materiali, options?.enabled]);

  return calculator;
}
