import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
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

    // Get preferences from user metadata
    const preferences = {
      language: user.user_metadata.language || 'it',
      dateFormat: user.user_metadata.date_format || 'DD/MM/YYYY',
      theme: user.user_metadata.theme || 'system',
      emailNotifications: user.user_metadata.email_notifications !== false,
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

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

    const { language, dateFormat, theme, emailNotifications } = await request.json()

    // Update user metadata with preferences
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        language: language || user.user_metadata.language,
        date_format: dateFormat || user.user_metadata.date_format,
        theme: theme || user.user_metadata.theme,
        email_notifications: emailNotifications !== undefined ? emailNotifications : user.user_metadata.email_notifications,
      },
    })

    if (updateError) {
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento delle preferenze' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Preferenze aggiornate con successo',
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
