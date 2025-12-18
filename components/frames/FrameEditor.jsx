'use client';

import React, { useState, useEffect } from 'react';
import { isValidPolygon, formatPerimeter, formatArea, calculateArea, calculatePerimeter, calculatePoints } from '@/lib/frames/geometry-utils';

/**
 * Componente per l'editing parametrico dei lati e angoli
 * Permette di modificare ogni lato e angolo con validazione real-time
 */
export default function FrameEditor({ frameConfig, onChange }) {
  const [lati, setLati] = useState(frameConfig.lati);
  const [angoli, setAngoli] = useState(frameConfig.angoli);
  const [validation, setValidation] = useState({ valid: true, error: null });

  // Valida e propaga cambiamenti al parent
  useEffect(() => {
    const validationResult = isValidPolygon(lati, angoli);
    setValidation(validationResult);

    if (validationResult.valid) {
      const points = calculatePoints(lati, angoli);
      const area = calculateArea(points);
      const perimetro = calculatePerimeter(lati);

      onChange({
        lati,
        angoli,
        points,
        area,
        perimetro,
        valid: true
      });
    } else {
      onChange({
        lati,
        angoli,
        valid: false,
        error: validationResult.error
      });
    }
  }, [lati, angoli]);

  // Handler cambio lunghezza lato
  const handleLatoChange = (index, newValue) => {
    const value = parseFloat(newValue) || 0;
    const newLati = [...lati];
    newLati[index] = {
      ...newLati[index],
      lunghezza: value
    };
    setLati(newLati);
  };

  // Handler cambio angolo
  const handleAngoloChange = (index, newValue) => {
    const value = parseFloat(newValue) || 0;
    const newAngoli = [...angoli];
    newAngoli[index] = {
      ...newAngoli[index],
      gradi: value
    };
    setAngoli(newAngoli);
  };

  // Calcola statistiche correnti
  const points = validation.valid ? calculatePoints(lati, angoli) : [];
  const area = validation.valid ? calculateArea(points) : 0;
  const perimetro = calculatePerimeter(lati);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-orbitron font-bold text-cyber-cyan mb-2">
          Definisci Misure
        </h2>
        <p className="text-gray-400">
          {frameConfig.nome} - Personalizza lati e angoli
        </p>
      </div>

      {/* Validation Banner */}
      {!validation.valid && (
        <div className="
          p-4 rounded-lg border-2 border-red-500/50
          bg-red-500/10 backdrop-blur-md
          text-red-400 text-center
          shadow-[0_0_20px_rgba(239,68,68,0.3)]
        ">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Configurazione non valida</span>
          </div>
          <p className="text-sm">{validation.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sezione Lati */}
        <div className="
          p-6 rounded-lg border-2 border-cyber-cyan/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-cyan/60 transition-all duration-300
        ">
          <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Lati (mm)
          </h3>

          <div className="space-y-4">
            {lati.map((lato, index) => {
              const isOutOfRange = lato.lunghezza < lato.minimo || lato.lunghezza > lato.massimo;

              return (
                <div key={lato.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {lato.label}
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={lato.lunghezza}
                      onChange={(e) => handleLatoChange(index, e.target.value)}
                      min={lato.minimo}
                      max={lato.massimo}
                      step="10"
                      className={`
                        flex-1 px-4 py-2 rounded-lg
                        bg-dark-blue/50 border-2
                        text-white font-mono
                        transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                        ${isOutOfRange
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-cyber-cyan/30 focus:border-cyber-cyan'
                        }
                      `}
                    />
                    <span className="text-gray-500 text-sm font-mono">mm</span>
                  </div>

                  {/* Range indicator */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {lato.minimo}mm</span>
                    <span>Max: {lato.massimo}mm</span>
                  </div>

                  {isOutOfRange && (
                    <p className="text-xs text-red-400">
                      Valore fuori range consentito
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sezione Angoli */}
        <div className="
          p-6 rounded-lg border-2 border-cyber-teal/30
          bg-muted-blue/50 backdrop-blur-md
          hover:border-cyber-teal/60 transition-all duration-300
        ">
          <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-cyber-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Angoli (°)
          </h3>

          <div className="space-y-4">
            {angoli.map((angolo, index) => {
              const isOutOfRange = angolo.gradi < angolo.minimo || angolo.gradi > angolo.massimo;

              return (
                <div key={angolo.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {angolo.label}
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={angolo.gradi}
                      onChange={(e) => handleAngoloChange(index, e.target.value)}
                      min={angolo.minimo}
                      max={angolo.massimo}
                      step="1"
                      className={`
                        flex-1 px-4 py-2 rounded-lg
                        bg-dark-blue/50 border-2
                        text-white font-mono
                        transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-cyber-teal/50
                        ${isOutOfRange
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-cyber-teal/30 focus:border-cyber-teal'
                        }
                      `}
                    />
                    <span className="text-gray-500 text-sm">°</span>
                  </div>

                  {/* Range indicator */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {angolo.minimo}°</span>
                    <span>Max: {angolo.massimo}°</span>
                  </div>

                  {isOutOfRange && (
                    <p className="text-xs text-red-400">
                      Valore fuori range consentito
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistiche */}
      {validation.valid && (
        <div className="
          p-6 rounded-lg border-2 border-cyber-cyan/30
          bg-gradient-to-br from-muted-blue/70 to-muted-blue/50
          backdrop-blur-md
          shadow-[0_0_30px_rgba(100,255,218,0.15)]
        ">
          <h3 className="text-lg font-orbitron font-bold text-cyber-cyan mb-4">
            Statistiche Calcolate
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Perimetro */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {formatPerimeter(perimetro)}
              </div>
              <div className="text-sm text-gray-400">Perimetro</div>
            </div>

            {/* Area */}
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-cyan mb-1">
                {formatArea(area)}
              </div>
              <div className="text-sm text-gray-400">Area Superficie</div>
            </div>

            {/* Numero lati */}
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-teal mb-1">
                {lati.length}
              </div>
              <div className="text-sm text-gray-400">Lati Totali</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
