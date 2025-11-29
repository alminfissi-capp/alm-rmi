'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Check if error is due to email not confirmed
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        error: 'Per favore verifica il tuo indirizzo email prima di accedere. Controlla la tua casella di posta (inclusa la cartella spam) per il link di verifica.'
      }
    }
    return { error: error.message }
  }

  // Double check if email is verified
  if (authData.user && !authData.user.email_confirmed_at) {
    await supabase.auth.signOut()
    return {
      error: 'Il tuo account non è ancora stato verificato. Controlla la tua email per il link di attivazione.'
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(`/verify-email?email=${encodeURIComponent(data.email)}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
