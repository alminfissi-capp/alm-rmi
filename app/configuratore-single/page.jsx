'use client';

import React, { useState, useEffect } from 'react';
import { Save, Download, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { FrameSelector } from '@/components/frames';
import { FrameEditorVisual } from '@/components/frames';
import { PriceCalculator } from '@/components/pricing';
import { getFrameConfig, cloneFrameConfig } from '@/lib/frames/frames-config';
import { mm2ToM2, calculatePoints, calculateArea, calculatePerimeter, isValidPolygon } from '@/lib/frames/geometry-utils';
import { useAutoPriceCalculator } from '@/hooks/use-price-calculator';
import { createClient } from '@/lib/supabase/client';
import DxfViewer from '@/components/DxfViewer';
import { getDxfFileForSerie, getProfiloInfo } from '@/lib/profili-config';

export default function ConfiguratoreSingleColumn() {
  const [userId, setUserId] = useState(null);

  // Stato configurazione completa
  const [config, setConfig] = useState({
    // Cliente & Commessa
    cliente: '',
    indirizzo: '',
    commessa: '',

    // Frame
    frameId: 'ante_2',
    frameData: null,

    // Materiali
    serie: 'premium',
    colore: 'bianco',
    vetro: 'doppio',

    // Prestazioni
    prestazioni: {
      termico: false,
      acustico: false,
      sicurezza: false
    },

    // Accessori
    accessori: {
      maniglia: 'standard',
      zanzariera: false,
      tapparella: false
    }
  });

  // Sezioni collassabili
  const [collapsed, setCollapsed] = useState({
    frame: false,
    misure: false,
    materiali: false,
    prestazioni: true,
    accessori: true,
    prezzo: false
  });

  // Recupera userId da Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  // Inizializza frameData
  useEffect(() => {
    const frameConfig = cloneFrameConfig(config.frameId);
    if (frameConfig) {
      let lati = frameConfig.lati;
      const angoli = frameConfig.angoli;

      if (lati.length === 2) {
        const larghezza = lati[0]?.lunghezza || 1200;
        const altezza = lati[1]?.lunghezza || 1400;

        lati = [
          { id: 'base', lunghezza: larghezza, label: 'Base', minimo: 300, massimo: 3000 },
          { id: 'destra', lunghezza: altezza, label: 'Altezza Destra', minimo: 300, massimo: 3000 },
          { id: 'alto', lunghezza: larghezza, label: 'Alto', minimo: 300, massimo: 3000 },
          { id: 'sinistra', lunghezza: altezza, label: 'Altezza Sinistra', minimo: 300, massimo: 3000 }
        ];
      }

      const validation = isValidPolygon(lati, angoli);
      if (validation.valid) {
        const points = calculatePoints(lati, angoli);
        const area = calculateArea(points);
        const perimetro = calculatePerimeter(lati);

        setConfig(prev => ({
          ...prev,
          frameData: { lati, angoli, points, area, perimetro, valid: true }
        }));
      }
    }
  }, [config.frameId]);

  // Calcolo prezzi automatico
  const priceCalculator = useAutoPriceCalculator(
    config.frameId,
    config.frameData?.lati?.[0]?.lunghezza || 0,
    config.frameData?.lati?.[1]?.lunghezza || 0,
    userId || 'demo-user',
    {
      n_ante: config.frameData?.lati?.length > 2 ? 2 : 1,
      tipo_apertura: 'battente',
      enabled: !!userId && !!config.frameData?.valid
    }
  );

  // Database prodotti
  const serie = {
    'basic': { nome: 'Basic Line', prezzo: 180, desc: 'Profili 50mm' },
    'comfort': { nome: 'Comfort Plus', prezzo: 280, desc: 'Profili 60mm' },
    'premium': { nome: 'Premium HD', prezzo: 380, desc: 'Profili 70mm' }
  };

  const colori = {
    'bianco': { nome: 'Bianco RAL 9010', hex: '#F1F0EA' },
    'grigio': { nome: 'Grigio Antracite RAL 7016', hex: '#383E42' },
    'marrone': { nome: 'Marrone Corten RAL 8019', hex: '#3D3635' },
    'verde': { nome: 'Verde Muschio RAL 6005', hex: '#114232' },
    'bronzo': { nome: 'Bronzo Metallizzato', hex: '#8B6F47' },
    'nero': { nome: 'Nero Opaco RAL 9005', hex: '#0E0E10' }
  };

  const tipiVetro = {
    'doppio': { nome: 'Doppio Vetro 4-16-4', ug: '1.1' },
    'triplo': { nome: 'Triplo Vetro 4-12-4-12-4', ug: '0.7' },
    'basso': { nome: 'Basso Emissivo Argon', ug: '0.6' },
    'selettivo': { nome: 'Selettivo Controllo Solare', ug: '0.5' }
  };

  const updateConfig = (key, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        newConfig[parent] = { ...newConfig[parent], [child]: value };
      } else {
        newConfig[key] = value;
      }
      return newConfig;
    });
  };

  const toggleSection = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const currentFrameConfig = cloneFrameConfig(config.frameId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header Fisso */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-cyan-500/30 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-cyan-400">Configuratore Infissi</h1>
              <p className="text-xs md:text-sm text-gray-400">A.L.M. Infissi - Palermo</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg transition-all">
                <Save className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              </button>
              <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg transition-all">
                <Download className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              </button>
              <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg transition-all">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Colonna Singola Scrollabile */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* 📋 SEZIONE: Info Cliente */}
        <section className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-cyan-500/30 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-cyan-400 mb-4">Informazioni Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Cliente</label>
              <input
                type="text"
                value={config.cliente}
                onChange={(e) => updateConfig('cliente', e.target.value)}
                placeholder="Nome cliente"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Indirizzo</label>
              <input
                type="text"
                value={config.indirizzo}
                onChange={(e) => updateConfig('indirizzo', e.target.value)}
                placeholder="Via, Città"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 🪟 SEZIONE: Selezione Frame */}
        <section className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
            onClick={() => toggleSection('frame')}
          >
            <h2 className="text-lg md:text-xl font-bold text-cyan-400">1. Seleziona Tipo Ante</h2>
            {collapsed.frame ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
          </div>
          {!collapsed.frame && (
            <div className="p-4 md:p-6 border-t border-gray-700">
              <FrameSelector
                selectedFrameId={config.frameId}
                onSelectFrame={(frameId) => updateConfig('frameId', frameId)}
              />
            </div>
          )}
        </section>

        {/* 📐 SEZIONE: Anteprima + Misure */}
        <section className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
            onClick={() => toggleSection('misure')}
          >
            <h2 className="text-lg md:text-xl font-bold text-cyan-400">2. Definisci Misure</h2>
            {collapsed.misure ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
          </div>
          {!collapsed.misure && currentFrameConfig && (
            <div className="p-4 md:p-6 border-t border-gray-700" style={{ height: '600px' }}>
              <FrameEditorVisual
                frameConfig={currentFrameConfig}
                onChange={(frameData) => updateConfig('frameData', frameData)}
              />
            </div>
          )}
        </section>

        {/* 🎨 SEZIONE: Materiali & Colori */}
        <section className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
            onClick={() => toggleSection('materiali')}
          >
            <h2 className="text-lg md:text-xl font-bold text-cyan-400">3. Materiali & Finiture</h2>
            {collapsed.materiali ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
          </div>
          {!collapsed.materiali && (
            <div className="p-4 md:p-6 border-t border-gray-700 space-y-6">

              {/* Serie Profilo */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Serie Profilo</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(serie).map(([key, val]) => (
                    <div
                      key={key}
                      onClick={() => updateConfig('serie', key)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        config.serie === key
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-gray-600 bg-gray-900/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-bold text-white">{val.nome}</div>
                      <div className="text-xs text-gray-400 mt-1">{val.desc}</div>
                      <div className="text-sm text-cyan-400 mt-2">€{val.prezzo}/m²</div>
                    </div>
                  ))}
                </div>

                {/* DXF Viewer */}
                {getDxfFileForSerie(config.serie) && (
                  <div className="mt-4 bg-gray-900/50 rounded-lg p-4">
                    <DxfViewer fileName={getDxfFileForSerie(config.serie)} className="h-32" />
                    <div className="mt-2 text-xs text-gray-400">
                      {getProfiloInfo(config.serie)?.nome} - {getProfiloInfo(config.serie)?.spessore}
                    </div>
                  </div>
                )}
              </div>

              {/* Colore */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Colore RAL</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {Object.entries(colori).map(([key, col]) => (
                    <div
                      key={key}
                      onClick={() => updateConfig('colore', key)}
                      className={`relative aspect-square rounded-lg cursor-pointer border-4 transition-all ${
                        config.colore === key ? 'border-cyan-400 scale-105' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.nome}
                    >
                      {config.colore === key && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tipo Vetro */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Tipo Vetro</label>
                <select
                  value={config.vetro}
                  onChange={(e) => updateConfig('vetro', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {Object.entries(tipiVetro).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.nome} - Ug {val.ug} W/m²K
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </section>

        {/* ⚙️ SEZIONE: Prestazioni */}
        <section className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
            onClick={() => toggleSection('prestazioni')}
          >
            <h2 className="text-lg md:text-xl font-bold text-cyan-400">4. Prestazioni Aggiuntive</h2>
            {collapsed.prestazioni ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
          </div>
          {!collapsed.prestazioni && (
            <div className="p-4 md:p-6 border-t border-gray-700 space-y-3">
              {['termico', 'acustico', 'sicurezza'].map((key) => (
                <label key={key} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg cursor-pointer hover:bg-gray-900/50">
                  <input
                    type="checkbox"
                    checked={config.prestazioni[key]}
                    onChange={(e) => updateConfig(`prestazioni.${key}`, e.target.checked)}
                    className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-white capitalize">{key}</span>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* 🔧 SEZIONE: Accessori */}
        <section className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
            onClick={() => toggleSection('accessori')}
          >
            <h2 className="text-lg md:text-xl font-bold text-cyan-400">5. Accessori</h2>
            {collapsed.accessori ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
          </div>
          {!collapsed.accessori && (
            <div className="p-4 md:p-6 border-t border-gray-700 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Tipo Maniglia</label>
                <select
                  value={config.accessori.maniglia}
                  onChange={(e) => updateConfig('accessori.maniglia', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="standard">Standard Alluminio</option>
                  <option value="premium">Premium Design (+€45)</option>
                  <option value="security">Security con Serratura (+€85)</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg cursor-pointer hover:bg-gray-900/50">
                <input
                  type="checkbox"
                  checked={config.accessori.zanzariera}
                  onChange={(e) => updateConfig('accessori.zanzariera', e.target.checked)}
                  className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="text-white">Zanzariera Avvolgibile (+€120)</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg cursor-pointer hover:bg-gray-900/50">
                <input
                  type="checkbox"
                  checked={config.accessori.tapparella}
                  onChange={(e) => updateConfig('accessori.tapparella', e.target.checked)}
                  className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="text-white">Tapparella Motorizzata (+€280)</span>
              </label>
            </div>
          )}
        </section>

        {/* 💰 SEZIONE: Preventivo */}
        <section className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md rounded-lg border-2 border-cyan-500/50 overflow-hidden sticky bottom-0">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan-900/20 transition-colors"
            onClick={() => toggleSection('prezzo')}
          >
            <div>
              <h2 className="text-lg md:text-xl font-bold text-cyan-400">Preventivo</h2>
              {priceCalculator.calcolo && (
                <div className="text-2xl md:text-3xl font-bold text-white mt-1">
                  €{priceCalculator.calcolo.totale?.toFixed(2) || '0.00'}
                </div>
              )}
            </div>
            {collapsed.prezzo ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
          </div>
          {!collapsed.prezzo && (
            <div className="p-4 md:p-6 border-t border-cyan-500/30">
              <PriceCalculator
                calcolo={priceCalculator.calcolo}
                loading={priceCalculator.loading}
                error={priceCalculator.error}
                showBreakdown={true}
                compact={false}
              />
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
