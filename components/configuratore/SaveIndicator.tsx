'use client';

import { Loader2, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/hooks/use-auto-save';

interface SaveIndicatorProps {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  errorMessage: string | null;
  className?: string;
}

export default function SaveIndicator({
  saveStatus,
  lastSavedAt,
  errorMessage,
  className,
}: SaveIndicatorProps) {
  // Config per ogni stato
  const statusConfig = {
    idle: {
      icon: null,
      text: '',
      color: '',
      show: false,
    },
    saving: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: 'Salvataggio in corso...',
      color: 'text-blue-600 border-blue-200 bg-blue-50 shadow-sm',
      show: true,
    },
    saved: {
      icon: <Check className="w-4 h-4" />,
      text: lastSavedAt
        ? `Salvato ${formatDistanceToNow(lastSavedAt, { locale: it, addSuffix: true })}`
        : 'Salvato',
      color: 'text-green-600 border-green-200 bg-green-50 shadow-sm',
      show: true,
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      text: errorMessage || 'Errore salvataggio',
      color: 'text-red-600 border-red-200 bg-red-50 shadow-sm',
      show: true,
    },
  };

  const config = statusConfig[saveStatus];

  if (!config.show) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md border',
        config.color,
        className
      )}
    >
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}
