'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import FrameSelectorComplete from '@/components/frames/FrameSelectorComplete';
import MeasureInput from './MeasureInput';
import RiepilogoSection from './RiepilogoSection';
import { ConfiguratoreState } from '@/hooks/use-configuratore-state';
import { cn } from '@/lib/utils';

interface ConfiguratoreSidebarProps {
  state: ConfiguratoreState;
  userId: string;
  pricing?: any; // Pricing data from usePriceCalculator
  actions: {
    setFrame: (frameId: string) => void;
    setMeasures: (larghezza: number, altezza: number) => void;
  };
}

export default function ConfiguratoreSidebar({
  state,
  userId,
  pricing,
  actions,
}: ConfiguratoreSidebarProps) {
  // Stato accordion: array sezioni aperte
  const [openSections, setOpenSections] = useState<string[]>(['section-1']);

  // Auto-apri sezione 2 quando frame selezionato
  useEffect(() => {
    if (state.frameId && !openSections.includes('section-2')) {
      setOpenSections((prev) => [...prev, 'section-2']);
    }
  }, [state.frameId, openSections]);

  return (
    <div className="space-y-4 pb-20 bg-white">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
        Configura Serramento
      </h1>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-3"
      >
        {/* SEZIONE 1: SELEZIONE FRAME */}
        <AccordionItem value="section-1" id="section-1" className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline px-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                1
              </div>
              <span className="text-gray-700">Selezione Frame</span>
              {state.frameId && (
                <span className="ml-auto text-xs text-gray-500 font-normal">
                  {state.frameConfig?.nome}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <FrameSelectorComplete
              selectedFrameId={state.frameId || undefined}
              onSelectFrame={(frameId: string) => {
                actions.setFrame(frameId);
                // Auto-scroll a sezione 2 dopo selezione
                setTimeout(() => {
                  document.getElementById('section-2')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }, 300);
              }}
            />
          </AccordionContent>
        </AccordionItem>

        {/* SEZIONE 2: MISURE */}
        <AccordionItem
          value="section-2"
          id="section-2"
          disabled={!state.frameId}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          <AccordionTrigger className="text-lg font-semibold hover:no-underline disabled:opacity-50 px-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold',
                  state.frameId
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-200 text-gray-400'
                )}
              >
                2
              </div>
              <span className="text-gray-700">Misure</span>
              {!state.frameId && (
                <span className="text-xs text-gray-500 ml-auto font-normal">
                  Seleziona prima un frame
                </span>
              )}
              {state.frameId && (
                <span className="ml-auto text-xs text-gray-500 font-normal">
                  {state.larghezza} × {state.altezza} mm
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <MeasureInput
              larghezza={state.larghezza}
              altezza={state.altezza}
              frameConfig={state.frameConfig}
              onChange={actions.setMeasures}
            />
          </AccordionContent>
        </AccordionItem>

        {/* SEZIONE 3: RIEPILOGO & PREZZO */}
        <AccordionItem value="section-3" id="section-3" disabled={!state.frameId} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline disabled:opacity-50 px-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold',
                  state.frameId
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-200 text-gray-400'
                )}
              >
                3
              </div>
              <span className="text-gray-700">Riepilogo & Prezzo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <RiepilogoSection state={state} pricing={pricing} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
