import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ConfiguratoreTablet from '@/components/configuratore/ConfiguratoreTablet';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ConfiguratorePage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  return <ConfiguratoreTablet userId={user.id} />;
}
