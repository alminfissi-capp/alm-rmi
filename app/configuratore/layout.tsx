import React from 'react';

export default function ConfiguratoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-full overflow-hidden bg-gray-100">
      {children}
    </main>
  );
}
