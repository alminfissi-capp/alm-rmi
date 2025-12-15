import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
        }

        if (!session.provider_token) {
            return NextResponse.json({
                error: 'Token Google non trovato. Effettua nuovamente il login con Google.'
            }, { status: 401 })
        }

        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({ access_token: session.provider_token })

        const people = google.people({ version: 'v1', auth: oauth2Client })

        const connections = await people.people.connections.list({
            resourceName: 'people/me',
            pageSize: 1000,
            personFields: 'names,emailAddresses,phoneNumbers,organizations,addresses',
        })

        const contacts = connections.data.connections || []
        let importedCount = 0
        let updatedCount = 0

        for (const person of contacts) {
            const nome = person.names?.[0]?.displayName
            if (!nome) continue

            const email = person.emailAddresses?.[0]?.value
            const telefono = person.phoneNumbers?.[0]?.value
            const indirizzo = person.addresses?.[0]?.formattedValue
            const organizzazione = person.organizations?.[0]?.name

            // Cerca se esiste già un cliente con questa email o nome
            let existingClient = null

            if (email) {
                existingClient = await prisma.cliente.findFirst({
                    where: {
                        user_id: session.user.id,
                        email: email
                    }
                })
            }

            if (!existingClient) {
                existingClient = await prisma.cliente.findFirst({
                    where: {
                        user_id: session.user.id,
                        nome: nome
                    }
                })
            }

            const clienteData = {
                user_id: session.user.id,
                nome: nome,
                email: email || null,
                telefono: telefono || null,
                indirizzo: indirizzo || null,
                ragione_sociale: organizzazione || null,
                tipologia: organizzazione ? 'azienda' as const : 'privato' as const,
                updated_at: new Date(),
            }

            if (existingClient) {
                // Aggiorna solo se mancano dati o per unire
                await prisma.cliente.update({
                    where: { id: existingClient.id },
                    data: clienteData
                })
                updatedCount++
            } else {
                // Crea nuovo
                await prisma.cliente.create({
                    data: {
                        ...clienteData,
                        created_at: new Date(),
                    }
                })
                importedCount++
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sincronizzazione completata: ${importedCount} nuovi, ${updatedCount} aggiornati`,
            stats: { imported: importedCount, updated: updatedCount }
        })

    } catch (error: any) {
        console.error('Error syncing Google Contacts:', error)
        return NextResponse.json({ error: error.message || 'Errore durante la sincronizzazione' }, { status: 500 })
    }
}
