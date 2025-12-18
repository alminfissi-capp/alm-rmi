'use client';

import React from 'react';
import { getAllFrames } from '@/lib/frames/frames-config';

/**
 * Componente per la selezione della forma geometrica
 * Mostra una griglia di card con le forme disponibili
 */
export default function FrameSelector({ selectedFrameId, onSelectFrame }) {
  const frames = getAllFrames();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-orbitron font-bold text-cyber-cyan mb-2">
          Seleziona Forma Geometrica
        </h2>
        <p className="text-gray-400">
          Scegli la forma base del tuo serramento
        </p>
      </div>

      {/* Griglia forme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frames.map((frame) => {
          const isSelected = selectedFrameId === frame.id;

          return (
            <button
              key={frame.id}
              onClick={() => onSelectFrame(frame.id)}
              className={`
                group relative p-6 rounded-lg
                border-2 transition-all duration-300
                backdrop-blur-md
                ${isSelected
                  ? 'border-cyber-cyan bg-muted-blue shadow-[0_0_30px_rgba(100,255,218,0.4),0_0_60px_rgba(100,255,218,0.2)]'
                  : 'border-cyber-cyan/30 bg-muted-blue/50 hover:border-cyber-cyan/60 hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]'
                }
              `}
            >
              {/* Barra superiore glow */}
              <div
                className={`
                  absolute top-0 left-0 right-0 h-1 rounded-t-lg
                  bg-gradient-to-r from-cyber-cyan to-cyber-teal
                  transition-opacity duration-300
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
              />

              {/* Icona SVG */}
              <div className="flex justify-center mb-4">
                <svg
                  viewBox="0 0 100 100"
                  className={`
                    w-32 h-32 transition-all duration-300
                    ${isSelected
                      ? 'drop-shadow-[0_0_12px_rgba(100,255,218,0.8)]'
                      : 'drop-shadow-[0_0_6px_rgba(100,255,218,0.4)] group-hover:drop-shadow-[0_0_10px_rgba(100,255,218,0.6)]'
                    }
                  `}
                >
                  <path
                    d={frame.icon}
                    fill="none"
                    stroke="#64ffda"
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>

              {/* Titolo */}
              <h3 className={`
                text-xl font-orbitron font-bold mb-2 transition-colors duration-300
                ${isSelected ? 'text-cyber-cyan' : 'text-white group-hover:text-cyber-cyan'}
              `}>
                {frame.nome}
              </h3>

              {/* Descrizione */}
              <p className="text-gray-400 text-sm mb-3">
                {frame.descrizione}
              </p>

              {/* Info tecnica */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-cyber-teal">{frame.punti}</span> punti
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="text-cyber-teal">{frame.lati.length}</span> lati
                </span>
              </div>

              {/* Badge selezionato */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="
                    px-3 py-1 rounded-full text-xs font-bold
                    bg-gradient-to-r from-cyber-cyan to-cyber-teal
                    text-dark-blue
                    shadow-[0_0_15px_rgba(100,255,218,0.6)]
                  ">
                    Selezionata
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info aggiuntive */}
      {selectedFrameId && (
        <div className="
          p-4 rounded-lg border-2 border-cyber-teal/30
          bg-muted-blue/30 backdrop-blur-md
          text-center text-sm text-gray-400
        ">
          <span className="text-cyber-teal font-semibold">
            Forma selezionata:
          </span> {frames.find(f => f.id === selectedFrameId)?.nome}
          <br />
          Clicca "Avanti" per definire le misure
        </div>
      )}
    </div>
  );
}
