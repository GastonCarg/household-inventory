'use client';

import { Home, MapPin, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';

const navItems = [
  {
    key: 'Home',
    href: '/',
    icon: Home,
  },
  {
    key: 'Locations',
    href: '/locations',
    icon: MapPin,
  },
] as const;

const Sidebar = () => {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const renderNav = () => (
    <nav aria-label={t('Navigation')} className="flex flex-1 flex-col gap-2">
      {navItems.map(({ key, href, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? 'bg-primary text-bg shadow-lg shadow-black/20'
                : 'text-fg-secondary hover:bg-muted hover:text-fg'
            }
          >
            <span className="flex min-h-[52px] items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200">
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span
                className="text-sm font-bold tracking-[0.24em] uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t(key)}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? t('CloseMenu') : t('OpenMenu')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="bg-surface-elevated border-divider text-fg hover:bg-muted fixed top-3 left-3 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg shadow-black/25 transition-colors lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-surface border-divider fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r px-4 py-5 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-divider)] px-2 pb-5">
          <div className="bg-primary text-bg flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-black/20">
            <Home className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-fg-muted text-[11px] font-semibold tracking-[0.28em] uppercase">
              {t('Inventory')}
            </p>
            <h2
              className="text-fg text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('Menu')}
            </h2>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 pt-6">{renderNav()}</div>
      </aside>
    </>
  );
};

export default Sidebar;
