import { RubricaClient } from './rubrica-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RubricaPage() {
  return (
    <div className="container mx-auto py-8">
      <RubricaClient />
    </div>
  )
}
