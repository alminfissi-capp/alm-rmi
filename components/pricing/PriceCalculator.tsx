/**
 * ============================================
 * COMPONENTE: PriceCalculator
 * ============================================
 *
 * Visualizza calcolo prezzi real-time nel configuratore
 * Stile cyber coerente con il tema dell'app
 */

'use client';

import React from 'react';
import { Loader2, Euro, Maximize2, CircleDot, Wrench, Package, Calculator } from 'lucide-react';
import type { CalcoloPrezzoResult } from '@/lib/pricing/calculate-price';
import { cn } from '@/lib/utils';

interface PriceCalculatorProps {
  calcolo: CalcoloPrezzoResult | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
  showBreakdown?: boolean;
  compact?: boolean;
}

export function PriceCalculator({
  calcolo,
  loading = false,
  error = null,
  className,
  showBreakdown = true,
  compact = false
}: PriceCalculatorProps) {
  // Formatta valuta
  const formatEuro = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn(
        "rounded-xl border-2 border-cyan-500/30 bg-slate-900/80 backdrop-blur-lg p-6",
        "flex items-center justify-center min-h-[200px]",
        className
      )}>
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-sm text-gray-400">Calcolo prezzi in corso...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || (calcolo && !calcolo.success)) {
    return (
      <div className={cn(
        "rounded-xl border-2 border-red-500/30 bg-red-900/20 backdrop-blur-lg p-6",
        className
      )}>
        <div className="text-center space-y-2">
          <div className="text-red-400 font-bold">⚠️ Errore Calcolo</div>
          <p className="text-sm text-red-300">
            {error || calcolo?.error || 'Impossibile calcolare il prezzo'}
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!calcolo) {
    return (
      <div className={cn(
        "rounded-xl border-2 border-cyan-500/20 bg-slate-900/60 backdrop-blur-lg p-6",
        "text-center",
        className
      )}>
        <Calculator className="w-12 h-12 text-cyan-400/50 mx-auto mb-3" />
        <p className="text-sm text-gray-400">
          Inserisci le misure per calcolare il prezzo
        </p>
      </div>
    );
  }

  const { breakdown, frame } = calcolo;

  // Compact mode - solo prezzo totale
  if (compact) {
    return (
      <div className={cn(
        "rounded-xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 to-slate-900/80",
        "backdrop-blur-lg p-4 shadow-lg shadow-cyan-500/20",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Prezzo Totale</span>
          </div>
          <div className="text-2xl font-bold cyber-gradient-text">
            {formatEuro(breakdown.totale)}
          </div>
        </div>

        {/* Mini info */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>{frame.area?.toFixed(2)} m²</span>
          <span>IVA {breakdown.iva_percentuale}% incl.</span>
        </div>
      </div>
    );
  }

  // Full mode - prezzo + breakdown
  return (
    <div className={cn(
      "rounded-xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 to-slate-900/80",
      "backdrop-blur-lg shadow-lg shadow-cyan-500/20 overflow-hidden",
      className
    )}>
      {/* Header - Prezzo Totale */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-cyan-100 uppercase tracking-wider mb-1">
              Preventivo Real-Time
            </p>
            <h3 className="text-3xl font-bold text-white drop-shadow-lg">
              {formatEuro(breakdown.totale)}
            </h3>
            <p className="text-xs text-cyan-100 mt-1">
              IVA {breakdown.iva_percentuale}% inclusa ({formatEuro(breakdown.iva_importo)})
            </p>
          </div>
          <div className="text-right">
            <Euro className="w-12 h-12 text-white/80" />
          </div>
        </div>
      </div>

      {/* Info Frame */}
      <div className="px-6 py-4 border-b border-cyan-500/20">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Frame</p>
            <p className="text-gray-200 font-medium">{frame.frame_nome}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Misure</p>
            <p className="text-gray-200 font-medium">
              {frame.larghezza} × {frame.altezza} mm
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Area</p>
            <p className="text-cyan-400 font-bold">
              {frame.area?.toFixed(2)} m²
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Perimetro</p>
            <p className="text-cyan-400 font-bold">
              {frame.perimetro?.toFixed(2)} ml
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Dettagliato */}
      {showBreakdown && (
        <div className="px-6 py-4 space-y-4">
          {/* Costi Base Frame */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-gray-300">Costi Base Frame</h4>
            </div>
            <div className="space-y-2 ml-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Area ({frame.area?.toFixed(2)} m²)
                </span>
                <span className="text-gray-200 font-medium">
                  {formatEuro(breakdown.costo_base_area)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Perimetro ({frame.perimetro?.toFixed(2)} ml)
                </span>
                <span className="text-gray-200 font-medium">
                  {formatEuro(breakdown.costo_base_perimetro)}
                </span>
              </div>
              {breakdown.moltiplicatore_ante_applicato !== 1 && (
                <div className="flex justify-between text-sm text-cyan-400">
                  <span>× Moltiplicatore ante</span>
                  <span>×{breakdown.moltiplicatore_ante_applicato.toFixed(2)}</span>
                </div>
              )}
              {breakdown.moltiplicatore_apertura_applicato !== 1 && (
                <div className="flex justify-between text-sm text-cyan-400">
                  <span>× Moltiplicatore apertura</span>
                  <span>×{breakdown.moltiplicatore_apertura_applicato.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-cyan-500/20">
                <span className="text-gray-300 font-medium">Subtotale Frame</span>
                <span className="text-cyan-400 font-bold">
                  {formatEuro(breakdown.subtotale_frame)}
                </span>
              </div>
            </div>
          </div>

          {/* Manodopera */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-gray-300">Manodopera</h4>
            </div>
            <div className="space-y-2 ml-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Costo per area</span>
                <span className="text-gray-200 font-medium">
                  {formatEuro(breakdown.costo_manodopera_area)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Costo fisso</span>
                <span className="text-gray-200 font-medium">
                  {formatEuro(breakdown.costo_manodopera_fissa)}
                </span>
              </div>
              {breakdown.costo_manodopera_extra > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Extra</span>
                  <span className="text-gray-200 font-medium">
                    {formatEuro(breakdown.costo_manodopera_extra)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-cyan-500/20">
                <span className="text-gray-300 font-medium">Subtotale Manodopera</span>
                <span className="text-cyan-400 font-bold">
                  {formatEuro(breakdown.subtotale_manodopera)}
                </span>
              </div>
            </div>
          </div>

          {/* Materiali Aggiuntivi */}
          {(breakdown.costi_vetro.length > 0 ||
            breakdown.costi_ferramenta.length > 0 ||
            breakdown.costi_accessori.length > 0) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-gray-300">Materiali Aggiuntivi</h4>
              </div>
              <div className="space-y-2 ml-6">
                {/* Vetri */}
                {breakdown.costi_vetro.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.nome} ({item.quantita}x)
                    </span>
                    <span className="text-gray-200 font-medium">
                      {formatEuro(item.totale)}
                    </span>
                  </div>
                ))}

                {/* Ferramenta */}
                {breakdown.costi_ferramenta.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.nome} ({item.quantita}x)
                    </span>
                    <span className="text-gray-200 font-medium">
                      {formatEuro(item.totale)}
                    </span>
                  </div>
                ))}

                {/* Accessori */}
                {breakdown.costi_accessori.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.nome} ({item.quantita}x)
                    </span>
                    <span className="text-gray-200 font-medium">
                      {formatEuro(item.totale)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-sm pt-2 border-t border-cyan-500/20">
                  <span className="text-gray-300 font-medium">Subtotale Materiali</span>
                  <span className="text-cyan-400 font-bold">
                    {formatEuro(breakdown.subtotale_materiali)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Totale Finale */}
          <div className="pt-4 border-t-2 border-cyan-500/40">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Subtotale</span>
                <span className="text-gray-200 font-medium">
                  {formatEuro(breakdown.subtotale)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">IVA ({breakdown.iva_percentuale}%)</span>
                <span className="text-gray-200 font-medium">
                  {formatEuro(breakdown.iva_importo)}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="text-white font-bold">TOTALE</span>
                <span className="text-2xl font-bold cyber-gradient-text">
                  {formatEuro(breakdown.totale)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-900/60 border-t border-cyan-500/20">
        <p className="text-xs text-gray-500 text-center">
          Preventivo generato il {new Date(calcolo.calcolato_at).toLocaleString('it-IT')}
        </p>
      </div>
    </div>
  );
}

/**
 * Componente compatto inline per uso in form
 */
export function PriceDisplayInline({
  calcolo,
  loading,
  error
}: Pick<PriceCalculatorProps, 'calcolo' | 'loading' | 'error'>) {
  const formatEuro = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-cyan-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Calcolo...</span>
      </div>
    );
  }

  if (error || !calcolo || !calcolo.success) {
    return (
      <div className="text-sm text-red-400">
        Errore calcolo
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Euro className="w-5 h-5 text-cyan-400" />
      <span className="text-xl font-bold cyber-gradient-text">
        {formatEuro(calcolo.breakdown.totale)}
      </span>
      <span className="text-xs text-gray-500">
        IVA incl.
      </span>
    </div>
  );
}
