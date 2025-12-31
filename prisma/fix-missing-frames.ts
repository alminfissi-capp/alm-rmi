/**
 * Fix Missing Frame Prices
 * Aggiunge prezzi per i frame ID mancanti
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMissingFrames() {
  console.log('🔧 Fix Missing Frame Prices - Inizio...\n');

  // Trova prezzario attivo
  const prezzario = await prisma.prezzario.findFirst({
    where: {
      user_id: '00000000-0000-0000-0000-000000000000',
      attivo: true
    }
  });

  if (!prezzario) {
    console.error('❌ Nessun prezzario trovato');
    return;
  }

  console.log(`✅ Prezzario trovato: ${prezzario.id}\n`);

  // Tutti i frame ID dalla libreria (36 totali)
  const allFrameIds = [
    'alzante_scorrevole',
    'angolare_dx',
    'angolare_sx',
    'anta_1_battente_dx',
    'anta_1_battente_sx',
    'anta_1_fissa',
    'anta_1_ribalta',
    'anta_larga_stretta',
    'ante_2_battenti',
    'ante_2_fisse',
    'ante_2_oscillo_battente',
    'ante_2_ribalta',
    'ante_2_sopraluce',
    'ante_2_sopraluce_ribalta',
    'ante_2x2_griglia',
    'ante_3_battenti',
    'ante_3_fisse',
    'ante_3_sopraluce',
    'ante_4_battenti',
    'ante_4_fisse',
    'battente_fissa_battente',
    'bow_window',
    'fissa_battente_dx',
    'fissa_battente_fissa',
    'fissa_battente_sopraluce',
    'fissa_battente_sx',
    'larga_stretta_fissa',
    'porta_finestra_1_anta',
    'porta_finestra_2_ante',
    'porta_finestra_fissa_battente',
    'porta_finestra_sopraluce',
    'scorrevole_2_ante',
    'scorrevole_3_ante',
    'scorrevole_complanare',
    'tre_ante_asimmetriche',
    'vetrata_continua'
  ];

  // Verifica quali frame esistono già
  const existingFrames = await prisma.prezzoFrame.findMany({
    where: { prezzario_id: prezzario.id },
    select: { frame_id: true }
  });

  const existingIds = new Set(existingFrames.map(f => f.frame_id));
  const missingIds = allFrameIds.filter(id => !existingIds.has(id));

  console.log(`📊 Frame esistenti: ${existingIds.size}`);
  console.log(`❌ Frame mancanti: ${missingIds.length}\n`);

  if (missingIds.length === 0) {
    console.log('✅ Tutti i frame hanno già i prezzi configurati!');
    return;
  }

  console.log('🔨 Aggiunta prezzi per frame mancanti...');
  console.log(missingIds.join(', '), '\n');

  // Mappa frame ID -> nome e prezzi
  const framePrices: Record<string, { nome: string; mq: number; ml: number; mano_mq: number; mano_fissa: number; molt_ante: number; molt_ap: number }> = {
    'anta_1_fissa': { nome: '1 Anta Fissa', mq: 180, ml: 22, mano_mq: 25, mano_fissa: 30, molt_ante: 1.0, molt_ap: 1.0 },
    'anta_1_battente_dx': { nome: '1 Anta Battente DX', mq: 220, ml: 28, mano_mq: 35, mano_fissa: 45, molt_ante: 1.0, molt_ap: 1.15 },
    'anta_1_battente_sx': { nome: '1 Anta Battente SX', mq: 220, ml: 28, mano_mq: 35, mano_fissa: 45, molt_ante: 1.0, molt_ap: 1.15 },
    'anta_1_ribalta': { nome: '1 Anta a Ribalta', mq: 240, ml: 30, mano_mq: 40, mano_fissa: 50, molt_ante: 1.0, molt_ap: 1.25 },
    'ante_2_fisse': { nome: '2 Ante Fisse', mq: 190, ml: 24, mano_mq: 28, mano_fissa: 40, molt_ante: 1.1, molt_ap: 1.0 },
    'ante_2_battenti': { nome: '2 Ante Battenti', mq: 250, ml: 32, mano_mq: 38, mano_fissa: 60, molt_ante: 1.15, molt_ap: 1.2 },
    'fissa_battente_dx': { nome: 'Fissa + Battente DX', mq: 230, ml: 30, mano_mq: 35, mano_fissa: 55, molt_ante: 1.1, molt_ap: 1.15 },
    'fissa_battente_sx': { nome: 'Fissa + Battente SX', mq: 230, ml: 30, mano_mq: 35, mano_fissa: 55, molt_ante: 1.1, molt_ap: 1.15 },
    'ante_2_oscillo_battente': { nome: '2 Ante Oscillo-Battente', mq: 280, ml: 35, mano_mq: 45, mano_fissa: 75, molt_ante: 1.2, molt_ap: 1.35 },
    'anta_larga_stretta': { nome: 'Anta Larga + Stretta', mq: 260, ml: 33, mano_mq: 40, mano_fissa: 65, molt_ante: 1.15, molt_ap: 1.25 },
    'ante_2_ribalta': { nome: '2 Ante Ribalta', mq: 270, ml: 34, mano_mq: 42, mano_fissa: 70, molt_ante: 1.15, molt_ap: 1.3 },
    'larga_stretta_fissa': { nome: 'Larga Batt. + Stretta Fissa', mq: 245, ml: 32, mano_mq: 38, mano_fissa: 62, molt_ante: 1.1, molt_ap: 1.2 },
    'ante_3_battenti': { nome: '3 Ante Battenti', mq: 280, ml: 38, mano_mq: 42, mano_fissa: 80, molt_ante: 1.25, molt_ap: 1.25 },
    'ante_3_fisse': { nome: '3 Ante Fisse', mq: 210, ml: 30, mano_mq: 30, mano_fissa: 50, molt_ante: 1.2, molt_ap: 1.0 },
    'fissa_battente_fissa': { nome: 'Fissa-Batt-Fissa', mq: 260, ml: 36, mano_mq: 40, mano_fissa: 70, molt_ante: 1.2, molt_ap: 1.2 },
    'battente_fissa_battente': { nome: 'Batt-Fissa-Batt', mq: 270, ml: 37, mano_mq: 41, mano_fissa: 75, molt_ante: 1.2, molt_ap: 1.25 },
    'tre_ante_asimmetriche': { nome: '3 Ante Asimmetriche', mq: 285, ml: 38, mano_mq: 43, mano_fissa: 82, molt_ante: 1.25, molt_ap: 1.3 },
    'ante_4_battenti': { nome: '4 Ante Battenti', mq: 300, ml: 42, mano_mq: 45, mano_fissa: 95, molt_ante: 1.3, molt_ap: 1.3 },
    'ante_4_fisse': { nome: '4 Ante Fisse', mq: 220, ml: 28, mano_mq: 32, mano_fissa: 60, molt_ante: 1.2, molt_ap: 1.0 },
    'ante_2x2_griglia': { nome: 'Griglia 2x2', mq: 250, ml: 35, mano_mq: 38, mano_fissa: 80, molt_ante: 1.25, molt_ap: 1.15 },
    'porta_finestra_1_anta': { nome: 'Porta-Finestra 1 Anta', mq: 240, ml: 32, mano_mq: 42, mano_fissa: 65, molt_ante: 1.0, molt_ap: 1.2 },
    'porta_finestra_2_ante': { nome: 'Porta-Finestra 2 Ante', mq: 280, ml: 38, mano_mq: 48, mano_fissa: 85, molt_ante: 1.15, molt_ap: 1.25 },
    'porta_finestra_sopraluce': { nome: 'Porta con Sopraluce', mq: 290, ml: 40, mano_mq: 50, mano_fissa: 90, molt_ante: 1.15, molt_ap: 1.3 },
    'porta_finestra_fissa_battente': { nome: 'Porta Fissa+Battente', mq: 270, ml: 36, mano_mq: 45, mano_fissa: 80, molt_ante: 1.1, molt_ap: 1.2 },
    'scorrevole_2_ante': { nome: 'Scorrevole 2 Ante', mq: 260, ml: 35, mano_mq: 45, mano_fissa: 75, molt_ante: 1.15, molt_ap: 1.4 },
    'scorrevole_3_ante': { nome: 'Scorrevole 3 Ante', mq: 290, ml: 40, mano_mq: 50, mano_fissa: 95, molt_ante: 1.25, molt_ap: 1.45 },
    'alzante_scorrevole': { nome: 'Alzante Scorrevole', mq: 320, ml: 45, mano_mq: 60, mano_fissa: 120, molt_ante: 1.2, molt_ap: 1.6 },
    'scorrevole_complanare': { nome: 'Scorrevole Complanare', mq: 310, ml: 42, mano_mq: 55, mano_fissa: 110, molt_ante: 1.2, molt_ap: 1.55 },
    'ante_2_sopraluce': { nome: '2 Ante + Sopraluce', mq: 270, ml: 36, mano_mq: 42, mano_fissa: 75, molt_ante: 1.15, molt_ap: 1.25 },
    'ante_3_sopraluce': { nome: '3 Ante + Sopraluce', mq: 300, ml: 42, mano_mq: 48, mano_fissa: 95, molt_ante: 1.25, molt_ap: 1.3 },
    'fissa_battente_sopraluce': { nome: 'Fissa+Batt + Sopraluce', mq: 260, ml: 34, mano_mq: 40, mano_fissa: 70, molt_ante: 1.1, molt_ap: 1.3 },
    'ante_2_sopraluce_ribalta': { nome: '2 Ante Sopral. Ribalta', mq: 280, ml: 37, mano_mq: 45, mano_fissa: 80, molt_ante: 1.15, molt_ap: 1.35 },
    'angolare_dx': { nome: 'Angolare Destra', mq: 310, ml: 45, mano_mq: 55, mano_fissa: 100, molt_ante: 1.3, molt_ap: 1.4 },
    'angolare_sx': { nome: 'Angolare Sinistra', mq: 310, ml: 45, mano_mq: 55, mano_fissa: 100, molt_ante: 1.3, molt_ap: 1.4 },
    'bow_window': { nome: 'Bow Window', mq: 350, ml: 50, mano_mq: 65, mano_fissa: 130, molt_ante: 1.4, molt_ap: 1.5 },
    'vetrata_continua': { nome: 'Vetrata Continua', mq: 210, ml: 30, mano_mq: 35, mano_fissa: 70, molt_ante: 1.2, molt_ap: 1.0 }
  };

  // Aggiungi solo i frame mancanti
  for (const frameId of missingIds) {
    const prices = framePrices[frameId];
    if (!prices) {
      console.log(`⚠️  Skipping ${frameId} - prezzi non definiti`);
      continue;
    }

    await prisma.prezzoFrame.create({
      data: {
        prezzario_id: prezzario.id,
        frame_id: frameId,
        frame_nome: prices.nome,
        prezzo_base_mq: prices.mq,
        prezzo_base_ml: prices.ml,
        manodopera_mq: prices.mano_mq,
        manodopera_fissa: prices.mano_fissa,
        moltiplicatore_ante: prices.molt_ante,
        moltiplicatore_apertura: prices.molt_ap,
        attivo: true
      }
    });

    console.log(`✅ ${frameId} - ${prices.nome}`);
  }

  console.log(`\n✅ Fix completato! Aggiunti ${missingIds.length} prezzi frame\n`);

  // Verifica finale
  const totalFrames = await prisma.prezzoFrame.count({
    where: { prezzario_id: prezzario.id }
  });

  console.log(`📊 Totale frame con prezzi: ${totalFrames}/36`);
}

fixMissingFrames()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Errore:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
