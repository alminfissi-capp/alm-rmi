'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Download, Save, Settings, Ruler, Package, Palette, Lock, Grid, Sun, Wind, Volume2, Info, ArrowLeft } from 'lucide-react';
import DxfViewer from '@/components/DxfViewer';
import { getDxfFileForSerie, getProfiloInfo } from '@/lib/profili-config';

const ConfiguratoreALM = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    tipo: 'finestra',
    larghezza: 120,
    altezza: 140,
    serie: 'premium',
    colore: 'bianco',
    finitura: 'verniciato',
    apertura: 'battente',
    vetro: 'doppio',
    prestazioni: {
      termico: true,
      acustico: false,
      sicurezza: false
    },
    accessori: {
      maniglia: 'standard',
      zanzariera: false,
      tapparella: false
    }
  });

  const [preventivo, setPreventivo] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);

  // Database prodotti
  const tipiInfisso = [
    { id: 'finestra', nome: 'Finestra', icon: '🪟', desc: 'Finestra singola o doppia anta' },
    { id: 'portafinestra', nome: 'Porta-Finestra', icon: '🚪', desc: 'Con soglia ribassata' },
    { id: 'scorrevole', nome: 'Scorrevole', icon: '↔️', desc: 'Finestra scorrevole o alzante' },
    { id: 'fissa', nome: 'Vetrata Fissa', icon: '▭', desc: 'Senza apertura' }
  ];

  const serie = {
    'basic': { nome: 'Basic Line', prezzo: 180, desc: 'Profili 50mm, prestazioni standard' },
    'comfort': { nome: 'Comfort Plus', prezzo: 280, desc: 'Profili 60mm, isolamento migliorato' },
    'premium': { nome: 'Premium HD', prezzo: 380, desc: 'Profili 70mm, massime prestazioni' },
    'design': { nome: 'Design Collection', prezzo: 480, desc: 'Profili slim, estetica minimale' }
  };

  const colori = {
    'bianco': { nome: 'Bianco RAL 9010', hex: '#F1F0EA', prezzo: 0 },
    'grigio': { nome: 'Grigio Antracite RAL 7016', hex: '#383E42', prezzo: 25 },
    'marrone': { nome: 'Marrone Corten RAL 8019', hex: '#3D3635', prezzo: 25 },
    'verde': { nome: 'Verde Muschio RAL 6005', hex: '#114232', prezzo: 30 },
    'bronzo': { nome: 'Bronzo Metallizzato', hex: '#8B6F47', prezzo: 45 },
    'nero': { nome: 'Nero Opaco RAL 9005', hex: '#0E0E10', prezzo: 30 }
  };

  const tipiVetro = {
    'doppio': { nome: 'Doppio Vetro 4-16-4', prezzo: 45, ug: '1.1' },
    'triplo': { nome: 'Triplo Vetro 4-12-4-12-4', prezzo: 85, ug: '0.7' },
    'basso': { nome: 'Basso Emissivo Argon', prezzo: 95, ug: '0.6' },
    'selettivo': { nome: 'Selettivo Controllo Solare', prezzo: 110, ug: '0.5' }
  };

  const aperture = {
    'finestra': ['battente', 'ribalta', 'anta-ribalta', 'vasistas'],
    'portafinestra': ['battente', 'scorrevole'],
    'scorrevole': ['scorrevole', 'alzante'],
    'fissa': ['fissa']
  };

  // Calcolo preventivo
  useEffect(() => {
    const calcolaPreventivo = () => {
      const superficie = (config.larghezza * config.altezza) / 10000; // m²
      let prezzo = serie[config.serie].prezzo * superficie;
      
      // Colore
      prezzo += colori[config.colore].prezzo * superficie;
      
      // Vetro
      prezzo += tipiVetro[config.vetro].prezzo * superficie;
      
      // Prestazioni extra
      if (config.prestazioni.termico) prezzo += 50 * superficie;
      if (config.prestazioni.acustico) prezzo += 45 * superficie;
      if (config.prestazioni.sicurezza) prezzo += 80 * superficie;
      
      // Accessori
      if (config.accessori.zanzariera) prezzo += 120;
      if (config.accessori.tapparella) prezzo += 280;
      if (config.accessori.maniglia === 'premium') prezzo += 45;
      if (config.accessori.maniglia === 'security') prezzo += 85;
      
      setPreventivo(Math.round(prezzo));
    };
    
    calcolaPreventivo();
  }, [config]);

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

  const renderVisualizzazione = () => {
    const { larghezza, altezza, colore, tipo } = config;
    const scale = Math.min(300 / larghezza, 300 / altezza);
    const w = larghezza * scale;
    const h = altezza * scale;
    const frameColor = colori[colore].hex;
    
    return (
      <div className="visualization-container">
        <div className="dimension-label top">{larghezza} cm</div>
        <div className="dimension-label left">{altezza} cm</div>
        
        <svg width={w + 60} height={h + 60} viewBox={`0 0 ${w + 60} ${h + 60}`}>
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e3f2fd" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#bbdefb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#90caf9" stopOpacity="0.3" />
            </linearGradient>
            <filter id="metalEffect">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Ombra */}
          <rect x="35" y="35" width={w} height={h} fill="rgba(0,0,0,0.15)" filter="blur(8px)" />
          
          {/* Telaio esterno */}
          <rect x="30" y="30" width={w} height={h} fill={frameColor} filter="url(#metalEffect)" rx="2" />
          
          {/* Vetro */}
          <rect x="42" y="42" width={w - 24} height={h - 24} fill="url(#glassGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Riflessi sul vetro */}
          <line x1="50" y1="50" x2={w - 20} y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="60" y1={h + 10} x2={w + 10} y2={h - 20} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          
          {/* Dettagli apertura */}
          {config.apertura === 'battente' && (
            <>
              <line x1={w / 2 + 30} y1="30" x2={w / 2 + 30} y2={h + 30} stroke={frameColor} strokeWidth="8" />
              <circle cx={w / 4 + 30} cy={h / 2 + 30} r="4" fill="#DAA520" />
            </>
          )}
          
          {config.apertura === 'scorrevole' && (
            <>
              <line x1={w * 0.6 + 30} y1="30" x2={w * 0.6 + 30} y2={h + 30} stroke={frameColor} strokeWidth="8" opacity="0.7" />
              <rect x={w * 0.55 + 30} y={h / 2 + 25} width="30" height="10" fill="#888" rx="5" />
            </>
          )}
        </svg>
        
        <div className="config-badge">{serie[config.serie].nome}</div>
        <div className="config-badge" style={{top: '360px'}}>{colori[config.colore].nome}</div>
      </div>
    );
  };

  return (
    <div className="configuratore">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .configuratore {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
          color: #e4e4e7;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        
        .configuratore::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(90deg, rgba(100, 255, 218, 0.03) 0px, transparent 1px, transparent 40px),
            repeating-linear-gradient(0deg, rgba(100, 255, 218, 0.03) 0px, transparent 1px, transparent 40px);
          pointer-events: none;
          z-index: 0;
        }
        
        .header {
          background: rgba(10, 14, 39, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(100, 255, 218, 0.1);
          padding: 1.5rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .logo {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #64ffda 0%, #4dd0e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          text-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .logo-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          color: #94a3b8;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 0.2rem;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        
        .btn-header {
          background: rgba(100, 255, 218, 0.1);
          border: 1px solid rgba(100, 255, 218, 0.3);
          color: #64ffda;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-header:hover {
          background: rgba(100, 255, 218, 0.2);
          border-color: #64ffda;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(100, 255, 218, 0.3);
        }
        
        .main-container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 3rem;
          display: grid;
          grid-template-columns: 1fr 500px;
          gap: 3rem;
          position: relative;
          z-index: 1;
        }
        
        .config-panel {
          background: rgba(15, 20, 40, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 255, 218, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .step-indicator {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .step-indicator::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 40px;
          right: 40px;
          height: 2px;
          background: rgba(100, 255, 218, 0.1);
          z-index: 0;
        }
        
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(30, 35, 55, 0.8);
          border: 2px solid rgba(100, 255, 218, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .step-item.active .step-circle {
          background: linear-gradient(135deg, #64ffda 0%, #4dd0e1 100%);
          border-color: #64ffda;
          color: #0a0e27;
          box-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
        }
        
        .step-item.completed .step-circle {
          background: rgba(100, 255, 218, 0.2);
          border-color: #64ffda;
        }
        
        .step-label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          text-align: center;
        }
        
        .step-item.active .step-label {
          color: #64ffda;
        }
        
        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .section-title svg {
          color: #64ffda;
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .option-card {
          background: rgba(30, 35, 55, 0.5);
          border: 2px solid rgba(100, 255, 218, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .option-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #64ffda, #4dd0e1);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .option-card:hover::before {
          transform: scaleX(1);
        }
        
        .option-card:hover {
          border-color: rgba(100, 255, 218, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(100, 255, 218, 0.2);
        }
        
        .option-card.selected {
          background: rgba(100, 255, 218, 0.1);
          border-color: #64ffda;
          box-shadow: 0 0 20px rgba(100, 255, 218, 0.3);
        }
        
        .option-card.selected::before {
          transform: scaleX(1);
        }
        
        .option-icon {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          filter: drop-shadow(0 2px 8px rgba(100, 255, 218, 0.3));
        }
        
        .option-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.4rem;
        }
        
        .option-desc {
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.4;
        }
        
        .input-group {
          margin-bottom: 2rem;
        }
        
        .input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .input-label svg {
          color: #64ffda;
          width: 18px;
          height: 18px;
        }
        
        .dimension-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .dimension-input {
          position: relative;
        }
        
        .dimension-input input {
          width: 100%;
          background: rgba(30, 35, 55, 0.8);
          border: 2px solid rgba(100, 255, 218, 0.2);
          border-radius: 8px;
          padding: 0.8rem 3rem 0.8rem 1rem;
          color: #f1f5f9;
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .dimension-input input:focus {
          border-color: #64ffda;
          box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.1);
        }
        
        .dimension-unit {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64ffda;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        .color-option {
          aspect-ratio: 1;
          border-radius: 12px;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .color-option::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          transition: transform 0.3s ease;
        }
        
        .color-option.selected {
          border-color: #64ffda;
          box-shadow: 0 0 20px rgba(100, 255, 218, 0.4);
          transform: scale(1.05);
        }
        
        .color-option.selected::after {
          transform: translate(-50%, -50%) scale(1);
        }
        
        .color-name {
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
          margin-top: 0.5rem;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .checkbox-item {
          background: rgba(30, 35, 55, 0.5);
          border: 2px solid rgba(100, 255, 218, 0.1);
          border-radius: 8px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .checkbox-item:hover {
          border-color: rgba(100, 255, 218, 0.3);
          background: rgba(30, 35, 55, 0.7);
        }
        
        .checkbox-item.checked {
          border-color: #64ffda;
          background: rgba(100, 255, 218, 0.1);
        }
        
        .checkbox-custom {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(100, 255, 218, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .checkbox-item.checked .checkbox-custom {
          background: #64ffda;
          border-color: #64ffda;
        }
        
        .checkbox-label {
          flex: 1;
          font-weight: 500;
          color: #e4e4e7;
        }
        
        .navigation-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 3rem;
        }
        
        .btn-nav {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          border-radius: 10px;
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-nav.primary {
          background: linear-gradient(135deg, #64ffda 0%, #4dd0e1 100%);
          color: #0a0e27;
          box-shadow: 0 4px 20px rgba(100, 255, 218, 0.3);
        }
        
        .btn-nav.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 30px rgba(100, 255, 218, 0.5);
        }
        
        .btn-nav.secondary {
          background: rgba(30, 35, 55, 0.8);
          border: 2px solid rgba(100, 255, 218, 0.3);
          color: #64ffda;
        }
        
        .btn-nav.secondary:hover {
          background: rgba(30, 35, 55, 1);
          border-color: #64ffda;
        }
        
        .preview-panel {
          position: sticky;
          top: 120px;
          height: fit-content;
        }
        
        .preview-card {
          background: rgba(15, 20, 40, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 255, 218, 0.1);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .preview-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .visualization-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          margin-bottom: 2rem;
          background: radial-gradient(circle at center, rgba(100, 255, 218, 0.05) 0%, transparent 70%);
          border-radius: 12px;
          padding: 2rem;
        }
        
        .dimension-label {
          position: absolute;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64ffda;
          background: rgba(10, 14, 39, 0.9);
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          border: 1px solid rgba(100, 255, 218, 0.3);
        }
        
        .dimension-label.top {
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .dimension-label.left {
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .config-badge {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10, 14, 39, 0.95);
          border: 1px solid rgba(100, 255, 218, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #cbd5e1;
          font-weight: 500;
        }
        
        .summary-section {
          margin-bottom: 1.5rem;
        }
        
        .summary-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #64ffda;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.8rem;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(100, 255, 218, 0.1);
          font-size: 0.9rem;
        }
        
        .summary-item:last-child {
          border-bottom: none;
        }
        
        .summary-label {
          color: #94a3b8;
        }
        
        .summary-value {
          color: #f1f5f9;
          font-weight: 600;
        }
        
        .price-display {
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(77, 208, 225, 0.1) 100%);
          border: 2px solid rgba(100, 255, 218, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 2rem;
          text-align: center;
        }
        
        .price-label {
          font-size: 0.85rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }
        
        .price-amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #64ffda 0%, #4dd0e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .price-note {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.5rem;
        }
        
        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn-action {
          padding: 1rem;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .btn-action.save {
          background: rgba(30, 35, 55, 0.8);
          border: 2px solid rgba(100, 255, 218, 0.3);
          color: #64ffda;
        }
        
        .btn-action.save:hover {
          background: rgba(30, 35, 55, 1);
          border-color: #64ffda;
          transform: translateY(-2px);
        }
        
        .btn-action.download {
          background: linear-gradient(135deg, #64ffda 0%, #4dd0e1 100%);
          color: #0a0e27;
          box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);
        }
        
        .btn-action.download:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(100, 255, 218, 0.5);
        }
        
        .select-custom {
          width: 100%;
          background: rgba(30, 35, 55, 0.8);
          border: 2px solid rgba(100, 255, 218, 0.2);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .select-custom:focus {
          border-color: #64ffda;
          box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.1);
        }
        
        @media (max-width: 1400px) {
          .main-container {
            grid-template-columns: 1fr;
          }
          
          .preview-panel {
            position: relative;
            top: 0;
          }
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 1rem 1.5rem;
          }
          
          .logo {
            font-size: 1.5rem;
          }
          
          .main-container {
            padding: 1.5rem;
            gap: 2rem;
          }
          
          .options-grid {
            grid-template-columns: 1fr;
          }
          
          .color-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="header">
        <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
          <a href="/dashboard" className="btn-header" style={{textDecoration: 'none'}}>
            <ArrowLeft size={18} />
            Torna a RMI
          </a>
          <div>
            <div className="logo">
              <Grid size={32} />
              ALM INFISSI
            </div>
            <div className="logo-subtitle">Configuratore Professionale</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-header">
            <Save size={18} />
            Salva
          </button>
          <button className="btn-header">
            <Download size={18} />
            Esporta PDF
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-container">
        {/* Configuration Panel */}
        <div className="config-panel">
          {/* Step Indicator */}
          <div className="step-indicator">
            {[1, 2, 3, 4, 5].map(s => (
              <div 
                key={s}
                className={`step-item ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
                onClick={() => setStep(s)}
              >
                <div className="step-circle">{s}</div>
                <div className="step-label">
                  {s === 1 && 'Tipo'}
                  {s === 2 && 'Dimensioni'}
                  {s === 3 && 'Materiali'}
                  {s === 4 && 'Prestazioni'}
                  {s === 5 && 'Accessori'}
                </div>
              </div>
            ))}
          </div>
          
          {/* Step 1: Tipo Infisso */}
          {step === 1 && (
            <div>
              <h2 className="section-title">
                <Package size={28} />
                Seleziona il Tipo di Infisso
              </h2>
              <div className="options-grid">
                {tipiInfisso.map(tipo => (
                  <div
                    key={tipo.id}
                    className={`option-card ${config.tipo === tipo.id ? 'selected' : ''}`}
                    onClick={() => updateConfig('tipo', tipo.id)}
                  >
                    <div className="option-icon">{tipo.icon}</div>
                    <div className="option-title">{tipo.nome}</div>
                    <div className="option-desc">{tipo.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 2: Dimensioni */}
          {step === 2 && (
            <div>
              <h2 className="section-title">
                <Ruler size={28} />
                Definisci le Dimensioni
              </h2>
              <div className="input-group">
                <div className="input-label">
                  <Settings size={18} />
                  Misure Personalizzate
                </div>
                <div className="dimension-inputs">
                  <div className="dimension-input">
                    <input
                      type="number"
                      value={config.larghezza}
                      onChange={(e) => updateConfig('larghezza', parseInt(e.target.value) || 0)}
                      min="60"
                      max="300"
                    />
                    <span className="dimension-unit">cm</span>
                    <div style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem'}}>Larghezza</div>
                  </div>
                  <div className="dimension-input">
                    <input
                      type="number"
                      value={config.altezza}
                      onChange={(e) => updateConfig('altezza', parseInt(e.target.value) || 0)}
                      min="80"
                      max="300"
                    />
                    <span className="dimension-unit">cm</span>
                    <div style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem'}}>Altezza</div>
                  </div>
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-label">
                  Serie Profilo
                </div>
                <select 
                  className="select-custom"
                  value={config.serie}
                  onChange={(e) => updateConfig('serie', e.target.value)}
                >
                  {Object.entries(serie).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.nome} - {val.desc} - €{val.prezzo}/m²
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <div className="input-label">
                  Tipo di Apertura
                </div>
                <select 
                  className="select-custom"
                  value={config.apertura}
                  onChange={(e) => updateConfig('apertura', e.target.value)}
                >
                  {aperture[config.tipo].map(ap => (
                    <option key={ap} value={ap}>
                      {ap.charAt(0).toUpperCase() + ap.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Step 3: Materiali */}
          {step === 3 && (
            <div>
              <h2 className="section-title">
                <Palette size={28} />
                Scegli Materiali e Finiture
              </h2>
              
              <div className="input-group">
                <div className="input-label">
                  Colore RAL
                </div>
                <div className="color-grid">
                  {Object.entries(colori).map(([key, col]) => (
                    <div key={key}>
                      <div
                        className={`color-option ${config.colore === key ? 'selected' : ''}`}
                        style={{ background: col.hex }}
                        onClick={() => updateConfig('colore', key)}
                      />
                      <div className="color-name">{col.nome}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-label">
                  Tipo di Vetro
                </div>
                <select 
                  className="select-custom"
                  value={config.vetro}
                  onChange={(e) => updateConfig('vetro', e.target.value)}
                >
                  {Object.entries(tipiVetro).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.nome} - Ug {val.ug} W/m²K - +€{val.prezzo}/m²
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Step 4: Prestazioni */}
          {step === 4 && (
            <div>
              <h2 className="section-title">
                <Settings size={28} />
                Prestazioni Aggiuntive
              </h2>
              
              <div className="checkbox-group">
                <div
                  className={`checkbox-item ${config.prestazioni.termico ? 'checked' : ''}`}
                  onClick={() => updateConfig('prestazioni.termico', !config.prestazioni.termico)}
                >
                  <div className="checkbox-custom">
                    {config.prestazioni.termico && '✓'}
                  </div>
                  <div>
                    <div className="checkbox-label">
                      <Sun size={18} style={{display: 'inline', marginRight: '0.5rem'}} />
                      Isolamento Termico Rinforzato
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem'}}>
                      Guarnizioni premium + taglio termico migliorato
                    </div>
                  </div>
                </div>
                
                <div
                  className={`checkbox-item ${config.prestazioni.acustico ? 'checked' : ''}`}
                  onClick={() => updateConfig('prestazioni.acustico', !config.prestazioni.acustico)}
                >
                  <div className="checkbox-custom">
                    {config.prestazioni.acustico && '✓'}
                  </div>
                  <div>
                    <div className="checkbox-label">
                      <Volume2 size={18} style={{display: 'inline', marginRight: '0.5rem'}} />
                      Isolamento Acustico
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem'}}>
                      Vetro stratificato 44.2 + vetrocamera asimmetrica
                    </div>
                  </div>
                </div>
                
                <div
                  className={`checkbox-item ${config.prestazioni.sicurezza ? 'checked' : ''}`}
                  onClick={() => updateConfig('prestazioni.sicurezza', !config.prestazioni.sicurezza)}
                >
                  <div className="checkbox-custom">
                    {config.prestazioni.sicurezza && '✓'}
                  </div>
                  <div>
                    <div className="checkbox-label">
                      <Lock size={18} style={{display: 'inline', marginRight: '0.5rem'}} />
                      Vetro Antisfondamento
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem'}}>
                      Classe P4A secondo EN 356 + ferramenta antieffrazione
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 5: Accessori */}
          {step === 5 && (
            <div>
              <h2 className="section-title">
                <Settings size={28} />
                Accessori e Finiture
              </h2>
              
              <div className="input-group">
                <div className="input-label">
                  Tipo Maniglia
                </div>
                <select 
                  className="select-custom"
                  value={config.accessori.maniglia}
                  onChange={(e) => updateConfig('accessori.maniglia', e.target.value)}
                >
                  <option value="standard">Standard Alluminio</option>
                  <option value="premium">Premium Design (+€45)</option>
                  <option value="security">Security con Serratura (+€85)</option>
                </select>
              </div>
              
              <div className="checkbox-group">
                <div
                  className={`checkbox-item ${config.accessori.zanzariera ? 'checked' : ''}`}
                  onClick={() => updateConfig('accessori.zanzariera', !config.accessori.zanzariera)}
                >
                  <div className="checkbox-custom">
                    {config.accessori.zanzariera && '✓'}
                  </div>
                  <div>
                    <div className="checkbox-label">
                      <Wind size={18} style={{display: 'inline', marginRight: '0.5rem'}} />
                      Zanzariera Avvolgibile
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem'}}>
                      Con cassonetto compatto e rete in fibra di vetro - +€120
                    </div>
                  </div>
                </div>
                
                <div
                  className={`checkbox-item ${config.accessori.tapparella ? 'checked' : ''}`}
                  onClick={() => updateConfig('accessori.tapparella', !config.accessori.tapparella)}
                >
                  <div className="checkbox-custom">
                    {config.accessori.tapparella && '✓'}
                  </div>
                  <div>
                    <div className="checkbox-label">
                      <Sun size={18} style={{display: 'inline', marginRight: '0.5rem'}} />
                      Tapparella Motorizzata
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem'}}>
                      Motore tubolare con radiocomando - +€280
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="navigation-buttons">
            {step > 1 && (
              <button className="btn-nav secondary" onClick={() => setStep(step - 1)}>
                Indietro
              </button>
            )}
            {step < 5 ? (
              <button className="btn-nav primary" onClick={() => setStep(step + 1)}>
                Avanti
                <ChevronRight size={20} />
              </button>
            ) : (
              <button className="btn-nav primary" onClick={() => alert('Configurazione completata!')}>
                Completa Configurazione
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-card">
            <h3 className="preview-title">Anteprima 3D</h3>
            
            {renderVisualizzazione()}
            
            <div className="summary-section">
              <div className="summary-title">Riepilogo Configurazione</div>
              <div className="summary-item">
                <span className="summary-label">Tipo:</span>
                <span className="summary-value">{tipiInfisso.find(t => t.id === config.tipo)?.nome}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Dimensioni:</span>
                <span className="summary-value">{config.larghezza} × {config.altezza} cm</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Serie:</span>
                <span className="summary-value">{serie[config.serie].nome}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Colore:</span>
                <span className="summary-value">{colori[config.colore].nome}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Apertura:</span>
                <span className="summary-value">{config.apertura.charAt(0).toUpperCase() + config.apertura.slice(1)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Vetro:</span>
                <span className="summary-value">{tipiVetro[config.vetro].nome}</span>
              </div>
            </div>

            {/* Sezione Profilo Tecnico DXF */}
            {getDxfFileForSerie(config.serie) && (
              <div className="summary-section" style={{marginTop: '2rem'}}>
                <div className="summary-title">Dettaglio Profilo Tecnico</div>
                <div style={{marginTop: '1rem'}}>
                  <DxfViewer
                    fileName={getDxfFileForSerie(config.serie)}
                    className="h-64"
                  />
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(100, 255, 218, 0.05)',
                    border: '1px solid rgba(100, 255, 218, 0.2)',
                    borderRadius: '8px'
                  }}>
                    <div style={{fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem'}}>
                      {getProfiloInfo(config.serie)?.nome}
                    </div>
                    <div style={{fontSize: '0.75rem', color: '#64748b'}}>
                      {getProfiloInfo(config.serie)?.descrizione}
                    </div>
                    <div style={{fontSize: '0.9rem', color: '#64ffda', marginTop: '0.5rem', fontWeight: 600}}>
                      Spessore: {getProfiloInfo(config.serie)?.spessore}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="price-display">
              <div className="price-label">Preventivo Indicativo</div>
              <div className="price-amount">€ {preventivo.toLocaleString()}</div>
              <div className="price-note">IVA esclusa • Include posa in opera</div>
            </div>
            
            <div className="action-buttons">
              <button className="btn-action save">
                <Save size={18} />
                Salva
              </button>
              <button className="btn-action download">
                <Download size={18} />
                Scarica PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratoreALM;