'use client'

import dynamic from 'next/dynamic'

// Disabilita SSR per evitare hydration mismatch con Radix UI Select
const RubricaClient = dynamic(
  () => import('./rubrica-client').then(mod => ({ default: mod.RubricaClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento rubrica...</p>
        </div>
      </div>
    ),
  }
)

export default function RubricaPage() {
  return (
    <div className="container mx-auto py-8">
      <RubricaClient />
    </div>
  )
}
