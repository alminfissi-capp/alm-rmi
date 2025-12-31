'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BottomNavbar from './BottomNavbar';
import FrameSelectionModal from './FrameSelectionModal';
import CanvasEditor from './CanvasEditor';

interface ConfiguratoreTabletProps {
  userId: string;
  rilievoId?: string;
  serramentoId?: string;
  onSaved?: (serramentoId: string) => void;
}

export default function ConfiguratoreTablet({
  userId,
  rilievoId,
  serramentoId,
  onSaved,
}: ConfiguratoreTabletProps) {

  // MODAL STATES
  const [showFrameModal, setShowFrameModal] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // SERRAMENTI STATE (lista infissi configurati)
  // INIZIO VUOTO - come WinStudio
  const [serramenti, setSerramenti] = useState<Array<{
    id: string;
    nome: string;
    numero: number;
    frameId: string;
    frameNome: string;
    larghezza: number;
    altezza: number;
  }>>([]);
  const [currentSerramentoId, setCurrentSerramentoId] = useState<string | null>(null);

  // Serramento corrente
  const currentSerramento = serramenti.find((s) => s.id === currentSerramentoId);

  // ACTIONS
  const handleChangeLarghezza = useCallback(
    (value: number) => {
      if (!currentSerramentoId) return;

      setSerramenti((prev) =>
        prev.map((s) =>
          s.id === currentSerramentoId ? { ...s, larghezza: value } : s
        )
      );
    },
    [currentSerramentoId]
  );

  const handleChangeAltezza = useCallback(
    (value: number) => {
      if (!currentSerramentoId) return;

      setSerramenti((prev) =>
        prev.map((s) =>
          s.id === currentSerramentoId ? { ...s, altezza: value } : s
        )
      );
    },
    [currentSerramentoId]
  );



  // BOTTOM NAVBAR HANDLERS
  const handleAddNew = () => {
    // Apre modal selezione frame
    setShowFrameModal(true);
  };

  const handleFrameConfirm = (frameId: string) => {
    // Mappa frameId → frameNome
    const frameNames: Record<string, string> = {
      anta_1_fissa: '1 Anta Fissa',
      ante_2_battenti: '2 Ante Battenti',
      ante_3_battenti: '3 Ante Battenti',
    };

    // Crea nuovo serramento con il frame selezionato
    const nuovoNumero = serramenti.length + 1;
    const nuovoId = `serramento-${Date.now()}`; // ID unico

    const nuovoSerramento = {
      id: nuovoId,
      nome: `Infisso ${nuovoNumero}`,
      numero: nuovoNumero,
      frameId,
      frameNome: frameNames[frameId] || frameId,
      larghezza: 1500,
      altezza: 1500,
    };

    setSerramenti((prev) => [...prev, nuovoSerramento]);
    setCurrentSerramentoId(nuovoId);

    // Chiude modal
    setShowFrameModal(false);

    toast.success(`Creato ${frameNames[frameId] || 'Infisso'}`);
  };

  const handleSettings = () => {
    setShowSettingsDrawer(true);
  };

  // INTERFACCIA PULITA
  const content = (
    <div className="relative h-full flex flex-col">
      {/* PULSANTE TORNA A RMI - Fixed in alto a sinistra */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna a RMI
      </Link>

      {/* CANVAS EDITOR - Dashboard di comando */}
      {currentSerramento ? (
        <CanvasEditor
          frameId={currentSerramento.frameId}
          frameNome={currentSerramento.frameNome}
          larghezza={currentSerramento.larghezza}
          altezza={currentSerramento.altezza}
          onChangeLarghezza={handleChangeLarghezza}
          onChangeAltezza={handleChangeAltezza}
        />
      ) : (
        // Schermata vuota
        <div className="flex-1 bg-gray-300" />
      )}

      {/* BOTTOM NAVBAR */}
      <BottomNavbar
        serramenti={serramenti}
        currentSerramentoId={currentSerramentoId}
        onAddNew={handleAddNew}
        onSelectSerramento={setCurrentSerramentoId}
        onSettings={handleSettings}
      />
    </div>
  );

  return (
    <>
      {/* FRAME SELECTION MODAL */}
      <FrameSelectionModal
        open={showFrameModal}
        onClose={() => setShowFrameModal(false)}
        onConfirm={handleFrameConfirm}
      />

      {/* CONTENT - Diretto, responsive nativo */}
      {content}
    </>
  );
}
