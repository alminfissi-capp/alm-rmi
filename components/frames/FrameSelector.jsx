'use client';

import React, { useState } from 'react';
import { getAllAnteConfigs, getAllFrames } from '@/lib/frames/frames-config';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente per la selezione della configurazione serramento
 * NUOVO: Mostra configurazioni ante professionali (1 anta, 2 ante, etc.)
 * LEGACY: Supporta ancora forme geometriche per compatibilità
 */
export default function FrameSelector({ selectedFrameId, onSelectFrame, mode = 'ante' }) {
  // mode: 'ante' = configurazioni ante, 'legacy' = forme geometriche
  const configs = mode === 'ante' ? getAllAnteConfigs() : getAllFrames();
  const [currentPage, setCurrentPage] = useState(0);
  const CONFIGS_PER_PAGE = 4;
  const totalPages = Math.ceil(configs.length / CONFIGS_PER_PAGE);

  const currentConfigs = configs.slice(
    currentPage * CONFIGS_PER_PAGE,
    (currentPage + 1) * CONFIGS_PER_PAGE
  );

  return (
    <div className="space-y-3">
      {/* Header Compatto */}
      <div className="text-center">
        <h2 className="text-lg font-orbitron font-bold text-cyber-cyan">
          {mode === 'ante' ? 'Configurazione' : 'Frame'}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {mode === 'ante' ? 'Seleziona tipo di serramento' : 'Seleziona forma geometrica'}
        </p>
      </div>

      {/* Griglia configurazioni - 2x2 compatto */}
      <div className="grid grid-cols-2 gap-3">
        {currentConfigs.map((config) => {
          const isSelected = selectedFrameId === config.id;

          return (
            <button
              key={config.id}
              onClick={() => onSelectFrame(config.id)}
              className={`
                group relative p-3 rounded-lg
                border-2 transition-all duration-300
                backdrop-blur-md
                ${isSelected
                  ? 'border-cyber-cyan bg-muted-blue shadow-[0_0_20px_rgba(100,255,218,0.4)]'
                  : 'border-cyber-cyan/30 bg-muted-blue/50 hover:border-cyber-cyan/60'
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

              {/* Icona SVG - RIDOTTA */}
              <div className="flex justify-center mb-2">
                <svg
                  viewBox="0 0 100 100"
                  className={`
                    w-16 h-16 transition-all duration-300
                    ${isSelected
                      ? 'drop-shadow-[0_0_10px_rgba(100,255,218,0.8)]'
                      : 'drop-shadow-[0_0_4px_rgba(100,255,218,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(100,255,218,0.6)]'
                    }
                  `}
                >
                  <path
                    d={config.icon}
                    fill="none"
                    stroke="#64ffda"
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>

              {/* Titolo + Categoria */}
              <div className="space-y-1">
                <h3 className={`
                  text-sm font-orbitron font-bold text-center transition-colors duration-300
                  ${isSelected ? 'text-cyber-cyan' : 'text-white group-hover:text-cyber-cyan'}
                `}>
                  {config.nome}
                </h3>
                {mode === 'ante' && config.apertura && (
                  <p className="text-[10px] text-center text-gray-400">
                    {config.apertura === 'battente' ? '🚪 Battente' : config.apertura === 'scorrevole' ? '↔️ Scorrevole' : ''}
                  </p>
                )}
              </div>

              {/* Badge selezionato */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="
                    w-2 h-2 rounded-full
                    bg-gradient-to-r from-cyber-cyan to-cyber-teal
                    shadow-[0_0_10px_rgba(100,255,218,0.8)]
                  ">
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Controlli paginazione swipe orizzontale */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`
              p-2 rounded-lg border transition-all duration-300
              ${currentPage === 0
                ? 'border-gray-700 bg-gray-800/30 text-gray-600 cursor-not-allowed'
                : 'border-cyber-cyan/40 bg-muted-blue/50 text-cyber-cyan hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(100,255,218,0.3)]'
              }
            `}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Indicatori pagina */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <div
                key={idx}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${idx === currentPage
                    ? 'bg-cyber-cyan shadow-[0_0_10px_rgba(100,255,218,0.8)] w-6'
                    : 'bg-gray-600'
                  }
                `}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className={`
              p-2 rounded-lg border transition-all duration-300
              ${currentPage === totalPages - 1
                ? 'border-gray-700 bg-gray-800/30 text-gray-600 cursor-not-allowed'
                : 'border-cyber-cyan/40 bg-muted-blue/50 text-cyber-cyan hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(100,255,218,0.3)]'
              }
            `}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
