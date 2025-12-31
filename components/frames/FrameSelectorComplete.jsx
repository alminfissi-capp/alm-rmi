'use client';

import React, { useState, useMemo } from 'react';
import { CATEGORIE_FRAMES, getConfigsByCategory, searchFrameConfigs } from '@/lib/frames/frames-config';
import { ChevronLeft, ChevronRight, Search, Grid3x3, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * FrameSelector Completo con Categorie e Ricerca
 * Stile PVC Windows Studio con 36+ configurazioni
 *
 * Features:
 * - Filtri per categoria (1 Anta, 2 Ante, Porte, etc.)
 * - Ricerca per nome
 * - Paginazione
 * - Visualizzazione grid responsive
 */
export default function FrameSelectorComplete({ selectedFrameId, onSelectFrame }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const FRAMES_PER_PAGE = 6; // 2 righe x 3 colonne

  // Filtra frames per categoria e ricerca
  const filteredFrames = useMemo(() => {
    let frames = [];

    // Filtra per categoria
    if (selectedCategory === 'all') {
      // Mostra tutti dalla libreria completa
      frames = CATEGORIE_FRAMES.flatMap(cat => getConfigsByCategory(cat.id));
    } else {
      frames = getConfigsByCategory(selectedCategory);
    }

    // Applica ricerca
    if (searchQuery.trim()) {
      frames = searchFrameConfigs(searchQuery);
    }

    return frames;
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredFrames.length / FRAMES_PER_PAGE);
  const currentFrames = filteredFrames.slice(
    currentPage * FRAMES_PER_PAGE,
    (currentPage + 1) * FRAMES_PER_PAGE
  );

  // Reset pagina quando cambia categoria o ricerca
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Seleziona Configurazione
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredFrames.length} configurazioni disponibili
        </p>
      </div>

      {/* Barra Ricerca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Cerca configurazione..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filtri Categoria - Scrollabile Orizzontale */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* Pulsante "Tutti" */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }
            `}
          >
            <Grid3x3 className="inline-block w-4 h-4 mr-1" />
            Tutti
          </button>

          {/* Categorie */}
          {CATEGORIE_FRAMES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }
              `}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.nome}
              <span className="ml-1 text-xs opacity-75">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Griglia Frame - 2 righe x 3 colonne */}
      {currentFrames.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentFrames.map((frame) => {
            const isSelected = selectedFrameId === frame.id;

            return (
              <button
                key={frame.id}
                onClick={() => onSelectFrame(frame.id)}
                className={`
                  group relative p-4 rounded-xl transition-all duration-300
                  border-2 hover:scale-105
                  ${isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-blue-400'
                  }
                `}
              >
                {/* Badge categoria */}
                <div className="absolute top-2 right-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {CATEGORIE_FRAMES.find(c => c.id === frame.categoria)?.icon || '🪟'}
                  </span>
                </div>

                {/* Icona SVG Frame */}
                <div className="flex justify-center mb-3">
                  <svg
                    viewBox="0 0 100 100"
                    className={`
                      w-20 h-20 transition-all duration-300
                      ${isSelected
                        ? 'drop-shadow-lg'
                        : 'opacity-70 group-hover:opacity-100'
                      }
                    `}
                  >
                    <path
                      d={frame.icon}
                      fill="none"
                      stroke={isSelected ? '#2563eb' : '#6b7280'}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>

                {/* Titolo */}
                <div className="space-y-1">
                  <h3 className={`
                    text-sm font-bold text-center transition-colors
                    ${isSelected
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white group-hover:text-blue-600'
                    }
                  `}>
                    {frame.nome}
                  </h3>

                  {/* Badge apertura */}
                  {frame.apertura && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      {frame.apertura === 'battente' && '🚪 Battente'}
                      {frame.apertura === 'scorrevole' && '↔️ Scorrevole'}
                      {frame.apertura === 'fisso' && '⬜ Fisso'}
                      {frame.apertura === 'ribalta' && '🔼 Ribalta'}
                      {frame.apertura === 'oscillo_battente' && '🔄 Oscillo-Batt.'}
                      {frame.apertura === 'alzante_scorrevole' && '⬆️ Alzante'}
                      {frame.apertura === 'mista' && '⚙️ Mista'}
                    </p>
                  )}
                </div>

                {/* Checkmark se selezionato */}
                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        // Nessun risultato
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Nessuna configurazione trovata
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Cancella ricerca
            </button>
          )}
        </div>
      )}

      {/* Paginazione */}
      {totalPages > 1 && currentFrames.length > 0 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={18} />
          </Button>

          {/* Indicatori pagina */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Pagina {currentPage + 1} di {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
        Libreria ALM Infissi v2.0 - {filteredFrames.length} configurazioni
      </div>
    </div>
  );
}

// Esporta anche stili CSS custom per scrollbar-hide
// Aggiungi in globals.css:
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
