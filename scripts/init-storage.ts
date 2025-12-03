/**
 * Script to initialize Supabase Storage bucket for RMI documents
 * Run with: npx tsx scripts/init-storage.ts
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function initStorage() {
  console.log("🚀 Inizializzazione Storage Supabase...")

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Errore: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devono essere definiti nel file .env")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if bucket exists
    console.log("📦 Verifica esistenza bucket 'rmi-documents'...")
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("❌ Errore durante il recupero dei buckets:", listError)
      process.exit(1)
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === "rmi-documents")

    if (bucketExists) {
      console.log("✓ Il bucket 'rmi-documents' esiste già")
    } else {
      console.log("📝 Creazione bucket 'rmi-documents'...")

      const { error: createError } = await supabase.storage.createBucket("rmi-documents", {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["application/pdf"],
      })

      if (createError) {
        if (createError.message.includes("already exists")) {
          console.log("✓ Il bucket 'rmi-documents' esiste già")
        } else {
          console.error("❌ Errore durante la creazione del bucket:", createError)
          process.exit(1)
        }
      } else {
        console.log("✓ Bucket 'rmi-documents' creato con successo")
      }
    }

    console.log("\n✅ Inizializzazione completata con successo!")
    console.log("\nConfigurazione bucket:")
    console.log("  - Nome: rmi-documents")
    console.log("  - Pubblico: No")
    console.log("  - Dimensione massima file: 10MB")
    console.log("  - Tipi consentiti: application/pdf")
  } catch (error) {
    console.error("❌ Errore imprevisto:", error)
    process.exit(1)
  }
}

initStorage()
