// ============================================
// Test Supabase Connection Page (with shadcn/ui)
// ============================================

import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default async function TestConnectionPage() {
  const supabase = await createClient();

  // Test 1: Check connection
  let connectionStatus = 'Unknown';
  let connectionError = null;

  try {
    const { data, error } = await supabase.from('rilievi').select('count').limit(1);

    if (error) {
      connectionStatus = 'Error';
      connectionError = error.message;
    } else {
      connectionStatus = 'Connected';
    }
  } catch (err) {
    connectionStatus = 'Error';
    connectionError = err instanceof Error ? err.message : 'Unknown error';
  }

  // Test 2: Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
            <p className="text-muted-foreground mt-2">Testing shadcn/ui components integration</p>
          </div>
          <ModeToggle />
        </div>

        <Separator />

        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Database Connection
            </CardTitle>
            <CardDescription>
              Testing connection to Supabase PostgreSQL database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {connectionStatus === 'Connected' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                  <Badge variant="default" className="bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800">
                    {connectionStatus}
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  <Badge variant="destructive">{connectionStatus}</Badge>
                </>
              )}
            </div>
            {connectionError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <strong>Error:</strong> {connectionError}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auth Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Current authentication status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">User:</span>
              {user ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                  <Badge variant="default" className="bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800">
                    Logged in as {user.email}
                  </Badge>
                </>
              ) : (
                <Badge variant="secondary">Not logged in</Badge>
              )}
            </div>
            {authError && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-900 dark:text-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <strong>Note:</strong> {authError.message}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables Card */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Checking required environment variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <Badge variant="default" className="bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800">
                  ✓ Set
                </Badge>
              ) : (
                <Badge variant="destructive">✗ Not set</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                <Badge variant="default" className="bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800">
                  ✓ Set
                </Badge>
              ) : (
                <Badge variant="destructive">✗ Not set</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-200">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 text-sm space-y-1">
              <li>If connection failed, check your .env file</li>
              <li>Make sure you've run the Prisma migrations</li>
              <li>Verify RLS policies are enabled in Supabase</li>
              <li>Check Supabase project is active</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
