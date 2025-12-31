'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Check, Delete } from 'lucide-react';

interface NumpadOverlayProps {
  open: boolean;
  initialValue: number;
  dimension: 'larghezza' | 'altezza';
  onConfirm: (value: number) => void;
  onCancel: () => void;
}

export default function NumpadOverlay({
  open,
  initialValue,
  dimension,
  onConfirm,
  onCancel,
}: NumpadOverlayProps) {
  const [displayValue, setDisplayValue] = useState(initialValue.toString());

  // Reset valore quando si apre
  useEffect(() => {
    if (open) {
      setDisplayValue(initialValue.toString());
    }
  }, [open, initialValue]);

  // Handler tasti numerici
  const handleNumberClick = (num: string) => {
    // Evita zeri iniziali
    if (displayValue === '0' && num !== '.') {
      setDisplayValue(num);
      return;
    }

    // Evita punti multipli
    if (num === '.' && displayValue.includes('.')) {
      return;
    }

    // Limita lunghezza (max 5 cifre)
    if (displayValue.length >= 5 && num !== '.') {
      return;
    }

    setDisplayValue(displayValue + num);
  };

  // Handler backspace
  const handleBackspace = () => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  // Handler conferma
  const handleConfirm = () => {
    const value = parseFloat(displayValue);

    // Validazione
    if (isNaN(value) || value <= 0) {
      return;
    }

    // Limiti min/max
    const min = 100;
    const max = 5000;
    const clampedValue = Math.max(min, Math.min(max, value));

    onConfirm(clampedValue);
  };

  // Handler annulla
  const handleCancel = () => {
    setDisplayValue(initialValue.toString());
    onCancel();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Numeri
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(e.key);
      }
      // Punto decimale
      else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleNumberClick('.');
      }
      // Backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
      // Enter = conferma
      else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
      // Escape = annulla
      else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, displayValue]);

  // Render condizionale DOPO tutti gli hooks
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-sm mx-4 p-6 shadow-2xl border-2 border-blue-500/50">
        {/* Header */}
        <div className="mb-4 text-center">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Modifica {dimension === 'larghezza' ? 'Larghezza' : 'Altezza'}
          </h3>
        </div>

        {/* Display Valore */}
        <div className="mb-6 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-inner">
          <div className="text-4xl font-bold text-center font-mono text-gray-900 tracking-wider">
            {displayValue}
          </div>
          <div className="text-xs text-center text-gray-500 mt-1">mm</div>
        </div>

        {/* Tastiera Numerica */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Riga 1: 7-8-9 */}
          {['7', '8', '9'].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              variant="outline"
              size="lg"
              className="h-14 text-xl font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              {num}
            </Button>
          ))}

          {/* Riga 2: 4-5-6 */}
          {['4', '5', '6'].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              variant="outline"
              size="lg"
              className="h-14 text-xl font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              {num}
            </Button>
          ))}

          {/* Riga 3: 1-2-3 */}
          {['1', '2', '3'].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              variant="outline"
              size="lg"
              className="h-14 text-xl font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              {num}
            </Button>
          ))}

          {/* Riga 4: ← 0 . */}
          <Button
            onClick={handleBackspace}
            variant="outline"
            size="lg"
            className="h-14 text-xl font-bold hover:bg-gray-100 transition-colors"
          >
            <Delete className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => handleNumberClick('0')}
            variant="outline"
            size="lg"
            className="h-14 text-xl font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            0
          </Button>

          <Button
            onClick={() => handleNumberClick('.')}
            variant="outline"
            size="lg"
            className="h-14 text-xl font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            .
          </Button>
        </div>

        {/* Pulsanti Azione */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            size="lg"
            className="h-12 bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-500 text-red-700 font-semibold"
          >
            <X className="w-5 h-5 mr-2" />
            Annulla
          </Button>

          <Button
            onClick={handleConfirm}
            variant="default"
            size="lg"
            className="h-12 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Conferma
          </Button>
        </div>

        {/* Info limiti */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Valori consentiti: 100 - 5000 mm
        </div>
      </Card>
    </div>
  );
}
