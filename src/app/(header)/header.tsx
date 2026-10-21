'use client';
import { Plus, ScanBarcode } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { ItemModalContext } from '@/(contexts)';
import SearchComponent from '../(search)/searchComponent';

const Header = () => {
  const { openModal, openScan } = useContext(ItemModalContext);
  const t = useTranslations('Header');

  return (
    <header
      aria-label="banner header"
      className="bg-surface border-divider flex h-auto items-center border-b px-4 py-4 sm:h-[72px] sm:justify-end sm:px-6"
    >
      <section className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        <SearchComponent />
        <button
          className="border-primary/40 text-primary hover:bg-primary/10 focus-visible:ring-primary focus-visible:ring-offset-surface flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-5 py-2.5 font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:min-h-0"
          onClick={openScan}
          type="button"
        >
          <ScanBarcode className="h-4 w-4" />
          <span className="text-sm">{t('Scan')}</span>
        </button>
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
