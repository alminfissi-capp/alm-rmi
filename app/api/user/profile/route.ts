import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { fullName, phone } = await request.json()

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName || user.user_metadata.full_name,
        phone: phone || user.user_metadata.phone,
      },
    })

    if (updateError) {
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento del profilo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Profilo aggiornato con successo',
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
