'use client';
import { Home, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { ItemModalContext } from '@/(contexts)';
import SearchComponent from '../(search)/searchComponent';

const Header = () => {
  const { openModal } = useContext(ItemModalContext);
  const t = useTranslations('Header');

  return (
    <header
      aria-label="banner header"
      className="bg-surface border-divider flex h-auto flex-col items-start justify-between gap-4 border-b px-6 py-4 sm:h-[72px] sm:flex-row sm:items-center"
    >
      <div className="flex items-center justify-center gap-3">
        <section className="rounded-xl bg-[#deff6ecc] p-2.5" aria-hidden="true">
          <Home className="h-5 w-5 text-[#090A0F]" />
        </section>
        <div>
          <h3
            aria-label="project name"
            className="text-fg text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('HouseholdInventory')}
          </h3>
          <p
            aria-label="description"
            className="text-fg-muted hidden text-xs font-medium tracking-wide uppercase sm:block"
          >
            {t('ManageHomeEssentials')}
          </p>
        </div>
      </div>
      <section className="order-2 flex w-full flex-col items-stretch gap-3 sm:order-none sm:w-auto sm:flex-row sm:items-center sm:gap-3">
        <SearchComponent />
        <button
          className="bg-primary hover:bg-primary-dark active:bg-primary-active text-bg focus-visible:ring-primary focus-visible:ring-offset-surface flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-none px-5 py-2.5 font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:min-h-0"
          onClick={openModal}
          type="button"
        >
          <Plus className="text-bg h-4 w-4" />
          <span className="text-sm">{t('AddItem')}</span>
        </button>
      </section>
    </header>
  );
};

export default Header;
