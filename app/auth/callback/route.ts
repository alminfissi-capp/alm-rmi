import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    // Scambia il code per una session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect alla pagina specificata (default: dashboard)
  // Se viene da "Connetti Google" in rubrica, next sarà '/rubrica'
  return NextResponse.redirect(`${origin}${next}`)
}
