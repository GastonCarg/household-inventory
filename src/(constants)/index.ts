import { CircleX, Package, TriangleAlert } from 'lucide-react';

import { IFilterSearch } from '@/lib/types';

export const STATUS_COLOR_MAP: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
    bgSummary: string;
    expiredText: string;
  }
> = {
  default: {
    text: 'text-blue-400',
    expiredText: 'text-blue-300',
    bg: 'bg-blue-500/15',
    bgSummary: 'bg-blue-500',
    border: 'border-blue-500/30',
  },
  warning: {
    text: 'text-amber-400',
    expiredText: 'text-amber-300',
    bg: 'bg-amber-500/15',
    bgSummary: 'bg-amber-500',
    border: 'border-amber-500/30',
  },
  error: {
    text: 'text-red-400',
    expiredText: 'text-red-300',
    bg: 'bg-red-500/15',
    bgSummary: 'bg-red-500',
    border: 'border-red-500/30',
  },
  success: {
    text: 'text-emerald-400',
    expiredText: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
    bgSummary: 'bg-emerald-500',
    border: 'border-emerald-500/30',
  },
};

export const STATUS_ICON_MAP: Record<string, React.ElementType> = {
  default: Package,
  warning: TriangleAlert,
  error: CircleX,
};

export const CARD_LEFT_BORDER: Record<string, string> = {
  default: 'border-l-4 border-l-blue-700',
  warning: 'border-l-4 border-l-amber-700',
  error: 'border-l-4 border-l-red-700',
  success: 'border-l-4 border-l-green-700',
};

export const SUMMARY_CARD_FILTER_MAP: Record<string, IFilterSearch['status']> =
  {
    default: 'all',
    warning: 'expiringSoon',
    error: 'expired',
  };

/**
 * Reusable Tailwind class strings for recurring UI patterns.
 * Edit once here — every component that imports these updates automatically.
 */
export const UI_CLASSES = {
  /* Form elements */
  input:
    'border border-surface-overlay bg-surface-input p-3 rounded-xl text-base text-fg placeholder:text-fg-dim focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all min-h-[44px]',
  label: 'text-xs font-semibold text-fg-muted uppercase tracking-wider',

  /* Buttons */
  buttonPrimary:
    'bg-primary hover:bg-primary-dark active:bg-primary-active text-bg font-semibold rounded-xl transition-all duration-150',
  buttonSecondary:
    'bg-transparent border border-surface-overlay text-fg-muted hover:bg-divider hover:text-fg rounded-xl transition-all duration-150 font-medium',

  /* Shared focus ring (accessibility) */
  focusRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-bg',

  /* Dropdown / contextual menus */
  dropdownMenu:
    'bg-surface-elevated border border-surface-overlay rounded-xl shadow-lg overflow-hidden',
} as const;

/** Chip shown in card footer for the product location. */
export const LOCATION_CHIP_CLASSES = {
  wrapper:
    'flex justify-center px-3 my-1 border rounded-full h-7 bg-indigo-500/15 border-indigo-400/30',
  inner: 'flex items-center justify-center gap-1.5 text-xs',
  icon: 'text-indigo-300 shrink-0',
  label: 'truncate font-medium text-indigo-300',
} as const;
