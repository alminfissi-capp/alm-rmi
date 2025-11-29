// ============================================
// PDF Email Sending API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { resend, getSenderEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, pdfBase64, pdfFilename } = body;

    // Validate required fields
    if (!to || !subject || !pdfBase64 || !pdfFilename) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, pdfBase64, pdfFilename' },
        { status: 400 }
      );
    }

    // Send email with PDF attachment using Resend
    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<p>Rilievo in allegato</p>`,
      text: text || 'Rilievo in allegato',
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to send email with PDF', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('PDF email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
