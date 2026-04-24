import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { CARD_LEFT_BORDER, STATUS_COLOR_MAP } from '@/(constants)';
import { Card } from '@/components';
import { formatDate, getExpirationDaysLeft } from '@/lib/helpers';
import { ItemsListComponentProps } from '../type';

export function ItemsListComponent({
  item,
  removeItem,
  editItem,
}: ItemsListComponentProps) {
  const t = useTranslations('ItemsList');
  const { locale } = useParams();
  const lang = locale === 'es' && 'es-AR';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { title, expireDate, quantity, location, id } = item;
  const daysLeft = getExpirationDaysLeft(expireDate ?? '');
  let textDaysLeft = `${daysLeft} ${t('DaysLeft')}`;
  const status =
    daysLeft <= 0 ? 'error' : daysLeft <= 3 ? 'warning' : 'success';
  if (daysLeft <= 0) {
    textDaysLeft = t('Expired');
  }

  return (
    <Card
      key={id}
      props={`group relative ${CARD_LEFT_BORDER[status] ?? ''}`}
      aria-label={title}
      tabIndex={0}
    >
      <div className="absolute top-3 right-3 z-10 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100 md:opacity-0">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-1.5 text-[#404460] transition-colors hover:bg-[#1E2130] hover:text-[#F2F4FF] focus-visible:ring-2 focus-visible:ring-[#deff6ecc] focus-visible:ring-offset-1 focus-visible:outline-none"
            aria-label={`${t('Actions')} ${title}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            type="button"
          >
            <MoreVertical size={16} />
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              aria-label={`${t('Actions')} ${title}`}
              className="absolute top-full right-0 z-20 mt-1 overflow-hidden rounded-xl border border-[#252836] bg-[#1A1D28] shadow-lg"
            >
              <button
                onClick={() => {
                  editItem(item);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-[#C4CBE8] transition-colors hover:bg-[#1E2130]"
                role="menuitem"
                aria-label={`${t('Edit')} ${title}`}
              >
                <Pencil size={14} className="text-[#8A90AB]" />
                <span className="text-sm font-medium">{t('Edit')}</span>
              </button>
              <button
                onClick={() => {
                  removeItem(id!);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-red-400 transition-colors hover:bg-red-950/40"
                role="menuitem"
                aria-label={`${t('Delete')} ${title}`}
              >
                <Trash2 size={14} />
                <span className="text-sm font-medium">{t('Delete')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <Card.Header props="flex justify-between my-0 pb-3">
        <div className="flex min-w-0 flex-1 items-center pr-6">
          <div
            aria-label="dishes icon"
            className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C1F2E] text-2xl"
          >
            🍽️
          </div>
          <section className="min-w-0">
            <h2
              className="flex-1 truncate pr-2 text-base leading-tight font-semibold text-[#F0F2FF] sm:text-lg"
              style={{ fontFamily: 'var(--font-product)' }}
            >
              {title}
            </h2>
            {quantity && (
              <p
                className="mt-0.5 text-xs font-medium text-[#8A90AB]"
                aria-label={`${t('Quantity')}: ${quantity}`}
              >
                {t('Quantity')}:{' '}
                <span className="font-semibold text-[#C4CBE8]">{quantity}</span>
              </p>
            )}
          </section>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-2">
          {expireDate && (
            <div className="flex items-center gap-1.5 text-xs text-[#8A90AB]">
              <Calendar
                size={13}
                className="shrink-0 text-[#404460]"
                aria-hidden="true"
              />
              <span className="truncate">
                {`${t('Expires')}: ${formatDate(expireDate, lang?.toString())}`}
              </span>
            </div>
          )}
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex w-full flex-row flex-wrap items-center gap-2">
          {location && (
            <div className="my-1 flex h-7 justify-center rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3">
              <div className="flex items-center justify-center gap-1.5 text-xs">
                <MapPin
                  size={11}
                  className="shrink-0 text-indigo-300"
                  aria-hidden="true"
                />
                <span className="truncate font-medium text-indigo-300">
                  {location.name}
                </span>
              </div>
            </div>
          )}
          <span
            className={`flex h-7 items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR_MAP[status].expiredText} ${STATUS_COLOR_MAP[status].bg ?? 'transparent'} border ${STATUS_COLOR_MAP[status].border ?? 'border-transparent'}`}
          >
            <Clock size={10} aria-hidden="true" />
            <span>{daysLeft <= 0 ? t('Expired') : `${textDaysLeft}`}</span>
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
}
