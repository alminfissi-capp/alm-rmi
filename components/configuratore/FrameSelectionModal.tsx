'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FrameOption {
  id: string;
  nome: string;
  icon: React.ReactNode;
}

interface FrameSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (frameId: string) => void;
}

export default function FrameSelectionModal({
  open,
  onClose,
  onConfirm,
}: FrameSelectionModalProps) {
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>('ante_2_battenti');

  // Frame disponibili - solo rettangoli 1-2-3 ante
  const frameOptions: FrameOption[] = [
    {
      id: 'anta_1_fissa',
      nome: '1 Anta',
      icon: <FrameIcon1Anta />,
    },
    {
      id: 'ante_2_battenti',
      nome: '2 Ante',
      icon: <FrameIcon2Ante />,
    },
    {
      id: 'ante_3_battenti',
      nome: '3 Ante',
      icon: <FrameIcon3Ante />,
    },
  ];

  const handleConfirm = () => {
    if (selectedFrameId) {
      onConfirm(selectedFrameId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-xl p-0 gap-0 bg-gray-200 border-0">
        {/* Header */}
        <DialogHeader className="bg-blue-400 p-4 m-0">
          <DialogTitle className="text-white text-center text-lg font-normal">
            configurazione
          </DialogTitle>
        </DialogHeader>

        {/* Griglia Frame */}
        <div className="p-8 bg-gray-400">
          <div className="grid grid-cols-3 gap-4">
            {frameOptions.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrameId(frame.id)}
                className={cn(
                  'aspect-square bg-white p-4 transition-all',
                  'hover:scale-105 active:scale-95',
                  selectedFrameId === frame.id
                    ? 'border-[6px] border-black shadow-xl'
                    : 'border-2 border-gray-600'
                )}
                title={frame.nome}
              >
                {frame.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-0">
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-14 rounded-none bg-blue-400 hover:bg-blue-500 text-white text-lg font-semibold uppercase"
          >
            NO
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedFrameId}
            variant="ghost"
            className="h-14 rounded-none bg-green-400 hover:bg-green-500 text-white text-lg font-semibold uppercase disabled:opacity-50"
          >
            SI
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// COMPONENTI ICONE FRAME
// ============================================

function FrameIcon1Anta() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Cornice esterna */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="#e0f2fe"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Vetro */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        fill="#bae6fd"
        stroke="#334155"
        strokeWidth="1"
      />
    </svg>
  );
}

function FrameIcon2Ante() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Cornice esterna */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="#e0f2fe"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Anta sinistra */}
      <rect
        x="15"
        y="15"
        width="32.5"
        height="70"
        fill="#bae6fd"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Divisore centrale */}
      <line
        x1="50"
        y1="10"
        x2="50"
        y2="90"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Anta destra */}
      <rect
        x="52.5"
        y="15"
        width="32.5"
        height="70"
        fill="#bae6fd"
        stroke="#334155"
        strokeWidth="1"
      />
    </svg>
  );
}

function FrameIcon3Ante() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Cornice esterna */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="#e0f2fe"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Anta sinistra */}
      <rect
        x="15"
        y="15"
        width="20"
        height="70"
        fill="#bae6fd"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Divisore 1 */}
      <line
        x1="36.67"
        y1="10"
        x2="36.67"
        y2="90"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Anta centrale */}
      <rect
        x="38.67"
        y="15"
        width="20"
        height="70"
        fill="#bae6fd"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Divisore 2 */}
      <line
        x1="63.33"
        y1="10"
        x2="63.33"
        y2="90"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Anta destra */}
      <rect
        x="65.33"
        y="15"
        width="20"
        height="70"
        fill="#bae6fd"
        stroke="#334155"
        strokeWidth="1"
      />
    </svg>
  );
}
