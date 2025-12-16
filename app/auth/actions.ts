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

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  })

  if (error) {
    // Handle specific Supabase errors
    if (error.message.includes('already registered') ||
        error.message.includes('already exists') ||
        error.message.includes('User already registered')) {
      return {
        error: 'Questa email è già registrata. Se hai dimenticato la password, contatta l\'amministratore.'
      }
    }
    return { error: error.message }
  }

  // Check if user was created but identities is empty (means user already exists)
  // This happens when email confirmations are disabled and user tries to sign up with existing email
  if (signUpData?.user && (!signUpData.user.identities || signUpData.user.identities.length === 0)) {
    return {
      error: 'Questa email è già registrata. Se hai dimenticato la password, contatta l\'amministratore.'
    }
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
