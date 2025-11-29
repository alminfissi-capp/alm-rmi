// ============================================
// Resend Email Client
// ============================================

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to get the sender email
export function getSenderEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
}
