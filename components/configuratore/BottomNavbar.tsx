'use client';

import { Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Serramento {
  id: string;
  nome: string;
  numero: number;
  frameNome?: string;
}

interface BottomNavbarProps {
  serramenti: Serramento[];
  currentSerramentoId: string | null;
  onAddNew: () => void;
  onSelectSerramento: (id: string) => void;
  onSettings: () => void;
  className?: string;
}

export default function BottomNavbar({
  serramenti,
  currentSerramentoId,
  onAddNew,
  onSelectSerramento,
  onSettings,
  className,
}: BottomNavbarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-gray-300 shadow-lg',
        'flex items-stretch',
        'h-16',
        className
      )}
    >
      {/* Bottone Sinistra: [+] Aggiungi Nuovo */}
      <button
        onClick={onAddNew}
        className="flex-shrink-0 w-16 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-colors"
        title="Aggiungi nuovo infisso"
      >
        <Plus className="w-8 h-8" strokeWidth={2.5} />
      </button>

      {/* Area Centrale: Tabs Infissi (scrollabile orizzontalmente) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-pink-500">
        <div className="flex items-stretch h-full px-2 gap-1">
          {serramenti.length === 0 ? (
            <div className="flex items-center justify-center w-full text-white text-sm">
              Nessun infisso creato
            </div>
          ) : (
            serramenti.map((serramento) => (
              <button
                key={serramento.id}
                onClick={() => onSelectSerramento(serramento.id)}
                className={cn(
                  'flex-shrink-0 w-14 flex flex-col items-center justify-center gap-0.5',
                  'border-2 transition-all',
                  currentSerramentoId === serramento.id
                    ? 'bg-white border-white'
                    : 'bg-pink-400 border-pink-400 hover:bg-pink-300 text-white'
                )}
                title={serramento.nome}
              >
                {/* Mini preview frame (placeholder) */}
                <div
                  className={cn(
                    'w-8 h-8 border-2 rounded-sm flex items-center justify-center text-xs font-bold',
                    currentSerramentoId === serramento.id
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-white bg-white/20 text-white'
                  )}
                >
                  {serramento.numero}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium truncate max-w-full px-1',
                    currentSerramentoId === serramento.id ? 'text-pink-600' : 'text-white'
                  )}
                >
                  {serramento.frameNome || `#${serramento.numero}`}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottone Destra: Opzioni/Settings */}
      <button
        onClick={onSettings}
        className="flex-shrink-0 w-16 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 active:bg-green-700 transition-colors"
        title="Opzioni infisso"
      >
        <User className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}
