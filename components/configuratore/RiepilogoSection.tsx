'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PriceCalculator } from '@/components/pricing/PriceCalculator';
import { ConfiguratoreState } from '@/hooks/use-configuratore-state';

interface RiepilogoSectionProps {
  state: ConfiguratoreState;
  pricing: any; // ReturnType useAutoPriceCalculator (to be added)
}

export default function RiepilogoSection({ state, pricing }: RiepilogoSectionProps) {
  const { frameConfig, larghezza, altezza, area, perimetro } = state;
  const { calcolo, loading, error } = pricing || { calcolo: null, loading: false, error: null };

  return (
    <div className="space-y-6">
      {/* CARD INFO FRAME */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
            <span className="text-blue-600">●</span>
            Dettagli Serramento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1 font-medium">Frame Selezionato</p>
              <p className="font-semibold text-blue-600">{frameConfig?.nome || '—'}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1 font-medium">Categoria</p>
              <p className="font-medium text-gray-700">
                {frameConfig?.categoria?.replace('_', ' ').toUpperCase() || '—'}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1 font-medium">Misure (L × H)</p>
              <p className="font-semibold text-lg text-gray-800">
                {larghezza} × {altezza} mm
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1 font-medium">Tipo Apertura</p>
              <p className="font-medium text-gray-700">
                {frameConfig?.apertura?.replace('_', ' ') || '—'}
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-3" />

          {/* Calcoli geometrici */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-4 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Area Totale</p>
              <p className="text-2xl font-bold text-blue-600">{area.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">m²</p>
            </div>

            <div className="text-center p-4 rounded-md bg-blue-50 border border-blue-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Perimetro</p>
              <p className="text-2xl font-bold text-blue-600">{perimetro.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">ml</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRICE CALCULATOR (RIUSO) */}
      <PriceCalculator
        calcolo={calcolo}
        loading={loading}
        error={error}
        showBreakdown={true}
        compact={false}
      />
    </div>
  );
}
