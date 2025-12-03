import { DashboardClient } from "./dashboard-client"

// Force dynamic rendering - this is a Server Component
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardPage() {
  return <DashboardClient />
}
