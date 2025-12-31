/**
 * ============================================
 * SEED PREZZARIO - Dati di Esempio
 * ============================================
 *
 * Crea un listino prezzi di esempio con:
 * - Prezzario attivo valido per tutto il 2025
 * - Voci materiali (profili, vetri, ferramenta)
 * - Prezzi per tutti i 36 frame della libreria
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPrezzario() {
  console.log('🌱 Seed Prezzario - Inizio...\n');

  // 1. Crea Prezzario Base 2025
  console.log('📋 Creazione Prezzario Base 2025...');
  const prezzario = await prisma.prezzario.create({
    data: {
      user_id: '00000000-0000-0000-0000-000000000000', // User di sistema/demo
      nome: 'Listino ALM Infissi 2025',
      descrizione: 'Listino base per configuratore infissi - Anno 2025',
      valido_da: new Date('2025-01-01'),
      valido_a: new Date('2025-12-31'),
      attivo: true
    }
  });
  console.log(`✅ Prezzario creato: ${prezzario.id}\n`);

  // 2. Crea Voci Materiali
  console.log('🔩 Creazione Voci Materiali...');

  // Vetri
  await prisma.vocePrezzario.createMany({
    data: [
      {
        prezzario_id: prezzario.id,
        categoria: 'vetro',
        codice: 'VET-DOP-4-16-4',
        nome: 'Vetro Doppio 4-16-4',
        descrizione: 'Vetro camera doppia 4mm-16mm-4mm',
        prezzo: 45.00,
        unita_misura: 'm2',
        attivo: true
      },
      {
        prezzario_id: prezzario.id,
        categoria: 'vetro',
        codice: 'VET-TRI-4-12-4-12-4',
        nome: 'Vetro Triplo 4-12-4-12-4',
        descrizione: 'Vetro camera tripla con gas argon',
        prezzo: 78.00,
        unita_misura: 'm2',
        attivo: true
      },
      {
        prezzario_id: prezzario.id,
        categoria: 'vetro',
        codice: 'VET-BASSO-4-16-4',
        nome: 'Vetro Bassoemissivo',
        descrizione: 'Vetro doppio con coating bassoemissivo',
        prezzo: 62.00,
        unita_misura: 'm2',
        attivo: true
      }
    ]
  });

  // Ferramenta
  await prisma.vocePrezzario.createMany({
    data: [
      {
        prezzario_id: prezzario.id,
        categoria: 'ferramenta',
        codice: 'FERR-CERNIERE-STD',
        nome: 'Cerniere Standard',
        descrizione: 'Set cerniere standard per finestra',
        prezzo: 18.00,
        unita_misura: 'pz',
        attivo: true
      },
      {
        prezzario_id: prezzario.id,
        categoria: 'ferramenta',
        codice: 'FERR-CERNIERE-RIN',
        nome: 'Cerniere Rinforzate',
        descrizione: 'Set cerniere rinforzate per ante pesanti',
        prezzo: 32.00,
        unita_misura: 'pz',
        attivo: true
      },
      {
        prezzario_id: prezzario.id,
        categoria: 'ferramenta',
        codice: 'FERR-SERRATURA',
        nome: 'Serratura Multipunto',
        descrizione: 'Serratura multipunto 3 punti',
        prezzo: 45.00,
        unita_misura: 'pz',
        attivo: true
      }
    ]
  });

  // Accessori
  await prisma.vocePrezzario.createMany({
    data: [
      {
        prezzario_id: prezzario.id,
        categoria: 'accessorio',
        codice: 'ACC-MANIGLIA-STD',
        nome: 'Maniglia Standard',
        descrizione: 'Maniglia standard alluminio',
        prezzo: 12.00,
        unita_misura: 'pz',
        attivo: true
      },
      {
        prezzario_id: prezzario.id,
        categoria: 'accessorio',
        codice: 'ACC-MANIGLIA-DESIGN',
        nome: 'Maniglia Design',
        descrizione: 'Maniglia design premium',
        prezzo: 28.00,
        unita_misura: 'pz',
        attivo: true
      }
    ]
  });

  console.log('✅ Voci materiali create\n');

  // 3. Crea Prezzi Frame (36 configurazioni)
  console.log('🪟 Creazione Prezzi Frame...');

  const framesData = [
    // 1 Anta (4 frames)
    { id: 'ante_1_fissa', nome: '1 Anta Fissa', mq: 180, ml: 22, mano_mq: 25, mano_fissa: 30, molt_ante: 1.0, molt_ap: 1.0 },
    { id: 'ante_1_battente_dx', nome: '1 Anta Battente DX', mq: 220, ml: 28, mano_mq: 35, mano_fissa: 45, molt_ante: 1.0, molt_ap: 1.15 },
    { id: 'ante_1_battente_sx', nome: '1 Anta Battente SX', mq: 220, ml: 28, mano_mq: 35, mano_fissa: 45, molt_ante: 1.0, molt_ap: 1.15 },
    { id: 'ante_1_ribalta', nome: '1 Anta a Ribalta', mq: 240, ml: 30, mano_mq: 40, mano_fissa: 50, molt_ante: 1.0, molt_ap: 1.25 },

    // 2 Ante (6 frames)
    { id: 'ante_2_fisse', nome: '2 Ante Fisse', mq: 190, ml: 24, mano_mq: 28, mano_fissa: 40, molt_ante: 1.1, molt_ap: 1.0 },
    { id: 'ante_2_battenti', nome: '2 Ante Battenti', mq: 250, ml: 32, mano_mq: 38, mano_fissa: 60, molt_ante: 1.15, molt_ap: 1.2 },
    { id: 'ante_2_fissa_battente', nome: '1 Fissa + 1 Battente', mq: 230, ml: 30, mano_mq: 35, mano_fissa: 55, molt_ante: 1.1, molt_ap: 1.15 },
    { id: 'ante_2_oscillo_battente', nome: '2 Ante Oscillo-Battente', mq: 280, ml: 35, mano_mq: 45, mano_fissa: 75, molt_ante: 1.2, molt_ap: 1.35 },
    { id: 'ante_2_battenti_asimm', nome: '2 Ante Asimmetriche', mq: 260, ml: 33, mano_mq: 40, mano_fissa: 65, molt_ante: 1.15, molt_ap: 1.25 },
    { id: 'ante_2_ribalta_battente', nome: 'Ribalta + Battente', mq: 270, ml: 34, mano_mq: 42, mano_fissa: 70, molt_ante: 1.15, molt_ap: 1.3 },

    // 3 Ante (4 frames)
    { id: 'ante_3_battenti', nome: '3 Ante Battenti', mq: 280, ml: 38, mano_mq: 42, mano_fissa: 80, molt_ante: 1.25, molt_ap: 1.25 },
    { id: 'ante_3_fissa_batt_fissa', nome: 'Fissa-Batt-Fissa', mq: 260, ml: 36, mano_mq: 40, mano_fissa: 70, molt_ante: 1.2, molt_ap: 1.2 },
    { id: 'ante_3_batt_fissa_batt', nome: 'Batt-Fissa-Batt', mq: 270, ml: 37, mano_mq: 41, mano_fissa: 75, molt_ante: 1.2, molt_ap: 1.25 },
    { id: 'ante_3_asimmetriche', nome: '3 Ante Asimmetriche', mq: 285, ml: 38, mano_mq: 43, mano_fissa: 82, molt_ante: 1.25, molt_ap: 1.3 },

    // 4 Ante (3 frames)
    { id: 'ante_4_battenti', nome: '4 Ante Battenti', mq: 300, ml: 42, mano_mq: 45, mano_fissa: 95, molt_ante: 1.3, molt_ap: 1.3 },
    { id: 'ante_4_fisse', nome: '4 Ante Fisse', mq: 220, ml: 28, mano_mq: 32, mano_fissa: 60, molt_ante: 1.2, molt_ap: 1.0 },
    { id: 'ante_4_griglia_2x2', nome: 'Griglia 2x2', mq: 250, ml: 35, mano_mq: 38, mano_fissa: 80, molt_ante: 1.25, molt_ap: 1.15 },

    // Porte-Finestre (4 frames)
    { id: 'porta_finestra_1_anta', nome: 'Porta-Finestra 1 Anta', mq: 240, ml: 32, mano_mq: 42, mano_fissa: 65, molt_ante: 1.0, molt_ap: 1.2 },
    { id: 'porta_finestra_2_ante', nome: 'Porta-Finestra 2 Ante', mq: 280, ml: 38, mano_mq: 48, mano_fissa: 85, molt_ante: 1.15, molt_ap: 1.25 },
    { id: 'porta_finestra_sopraluce', nome: 'Porta con Sopraluce', mq: 290, ml: 40, mano_mq: 50, mano_fissa: 90, molt_ante: 1.15, molt_ap: 1.3 },
    { id: 'porta_fissa_battente', nome: 'Porta Fissa+Battente', mq: 270, ml: 36, mano_mq: 45, mano_fissa: 80, molt_ante: 1.1, molt_ap: 1.2 },

    // Scorrevoli (4 frames)
    { id: 'scorrevole_2_ante', nome: 'Scorrevole 2 Ante', mq: 260, ml: 35, mano_mq: 45, mano_fissa: 75, molt_ante: 1.15, molt_ap: 1.4 },
    { id: 'scorrevole_3_ante', nome: 'Scorrevole 3 Ante', mq: 290, ml: 40, mano_mq: 50, mano_fissa: 95, molt_ante: 1.25, molt_ap: 1.45 },
    { id: 'alzante_scorrevole', nome: 'Alzante Scorrevole', mq: 320, ml: 45, mano_mq: 60, mano_fissa: 120, molt_ante: 1.2, molt_ap: 1.6 },
    { id: 'scorrevole_complanare', nome: 'Scorrevole Complanare', mq: 310, ml: 42, mano_mq: 55, mano_fissa: 110, molt_ante: 1.2, molt_ap: 1.55 },

    // Con Sopraluce (4 frames)
    { id: 'ante_2_sopraluce', nome: '2 Ante + Sopraluce', mq: 270, ml: 36, mano_mq: 42, mano_fissa: 75, molt_ante: 1.15, molt_ap: 1.25 },
    { id: 'ante_3_sopraluce', nome: '3 Ante + Sopraluce', mq: 300, ml: 42, mano_mq: 48, mano_fissa: 95, molt_ante: 1.25, molt_ap: 1.3 },
    { id: 'ribalta_sopraluce_fissa', nome: 'Ribalta + Sopraluce Fisso', mq: 260, ml: 34, mano_mq: 40, mano_fissa: 70, molt_ante: 1.1, molt_ap: 1.3 },
    { id: 'batt_sopraluce_ribalta', nome: 'Battente + Sopral. Ribalta', mq: 280, ml: 37, mano_mq: 45, mano_fissa: 80, molt_ante: 1.15, molt_ap: 1.35 },

    // Asimmetriche (3 frames)
    { id: 'asimmetrica_70_30_dx', nome: 'Asimmetrica 70/30 DX', mq: 245, ml: 32, mano_mq: 38, mano_fissa: 65, molt_ante: 1.1, molt_ap: 1.2 },
    { id: 'asimmetrica_70_30_sx', nome: 'Asimmetrica 70/30 SX', mq: 245, ml: 32, mano_mq: 38, mano_fissa: 65, molt_ante: 1.1, molt_ap: 1.2 },
    { id: 'asimmetrica_3_ante_custom', nome: '3 Ante Asimm. Custom', mq: 290, ml: 40, mano_mq: 45, mano_fissa: 85, molt_ante: 1.25, molt_ap: 1.3 },

    // Speciali (4 frames)
    { id: 'angolare_dx', nome: 'Angolare Destra', mq: 310, ml: 45, mano_mq: 55, mano_fissa: 100, molt_ante: 1.3, molt_ap: 1.4 },
    { id: 'angolare_sx', nome: 'Angolare Sinistra', mq: 310, ml: 45, mano_mq: 55, mano_fissa: 100, molt_ante: 1.3, molt_ap: 1.4 },
    { id: 'bow_window', nome: 'Bow Window', mq: 350, ml: 50, mano_mq: 65, mano_fissa: 130, molt_ante: 1.4, molt_ap: 1.5 },
    { id: 'vetrata_continua', nome: 'Vetrata Continua', mq: 210, ml: 30, mano_mq: 35, mano_fissa: 70, molt_ante: 1.2, molt_ap: 1.0 }
  ];

  for (const frame of framesData) {
    await prisma.prezzoFrame.create({
      data: {
        prezzario_id: prezzario.id,
        frame_id: frame.id,
        frame_nome: frame.nome,
        prezzo_base_mq: frame.mq,
        prezzo_base_ml: frame.ml,
        manodopera_mq: frame.mano_mq,
        manodopera_fissa: frame.mano_fissa,
        moltiplicatore_ante: frame.molt_ante,
        moltiplicatore_apertura: frame.molt_ap,
        attivo: true
      }
    });
  }

  console.log(`✅ ${framesData.length} prezzi frame creati\n`);

  console.log('✅ Seed Prezzario completato con successo!\n');
  console.log('📊 Riepilogo:');
  console.log(`   - 1 Prezzario attivo`);
  console.log(`   - ${await prisma.vocePrezzario.count()} Voci materiali`);
  console.log(`   - ${await prisma.prezzoFrame.count()} Prezzi frame`);
}

seedPrezzario()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Errore durante seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
