'use client';

import { useState, useEffect, useRef } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  debounceMs?: number;
  onSave: (data: any) => Promise<{ success: boolean; id?: string; error?: string }>;
  onSuccess?: (id: string) => void;
  onError?: (error: string) => void;
}

interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  errorMessage: string | null;
  isSaving: boolean;
  isSaved: boolean;
  isError: boolean;
}

export function useAutoSave(data: any, options: UseAutoSaveOptions): UseAutoSaveReturn {
  const { debounceMs = 2500, onSave, onSuccess, onError } = options;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const saveCounter = useRef(0);

  useEffect(() => {
    // Skip se data non validi
    if (!data || !data.frameId || !data.larghezza || !data.altezza) {
      return;
    }

    // Cancella timer precedente
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset status
    setSaveStatus('idle');

    // Imposta nuovo timer
    debounceTimer.current = setTimeout(async () => {
      const currentSave = ++saveCounter.current;
      setSaveStatus('saving');
      setErrorMessage(null);

      try {
        const result = await onSave(data);

        // Check se questo save è ancora il più recente
        if (currentSave !== saveCounter.current) {
          console.log('Save obsoleto, ignoro risultato');
          return;
        }

        if (result.success) {
          setSaveStatus('saved');
          setLastSavedAt(new Date());

          if (result.id && onSuccess) {
            onSuccess(result.id);
          }

          // Reset a idle dopo 3 secondi
          setTimeout(() => {
            setSaveStatus('idle');
          }, 3000);
        } else {
          setSaveStatus('error');
          const msg = result.error || 'Errore salvataggio sconosciuto';
          setErrorMessage(msg);

          if (onError) {
            onError(msg);
          }
        }
      } catch (err) {
        if (currentSave !== saveCounter.current) return;

        setSaveStatus('error');
        const msg = err instanceof Error ? err.message : 'Errore di rete';
        setErrorMessage(msg);

        if (onError) {
          onError(msg);
        }
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data, debounceMs, onSave, onSuccess, onError]);

  return {
    saveStatus,
    lastSavedAt,
    errorMessage,
    isSaving: saveStatus === 'saving',
    isSaved: saveStatus === 'saved',
    isError: saveStatus === 'error',
  };
}
