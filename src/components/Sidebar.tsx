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

const menuButtonClasses =
  'bg-surface-elevated border-divider text-fg hover:bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-colors';

const Logo = () => (
  <div
    className="bg-primary text-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-black/20"
    aria-hidden="true"
  >
    <Home className="h-5 w-5" />
  </div>
);

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
      {/* Mobile top bar: keeps the menu button in the flow instead of floating over the page */}
      <div className="bg-surface border-divider sticky top-0 z-30 flex w-full items-center gap-3 border-b px-4 py-3 lg:hidden">
        <button
          type="button"
          aria-label={t('OpenMenu')}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className={menuButtonClasses}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <p
          className="text-fg truncate text-xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('HouseholdInventory')}
        </p>
      </div>

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
          <Logo />
          <div className="min-w-0 flex-1">
            <h2
              className="text-fg text-lg leading-tight font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('HouseholdInventory')}
            </h2>
            <p className="text-fg-muted mt-1 text-[11px] font-medium tracking-wide uppercase">
              {t('ManageHomeEssentials')}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('CloseMenu')}
            onClick={() => setIsOpen(false)}
            className={`${menuButtonClasses} lg:hidden`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 pt-6">{renderNav()}</div>
      </aside>
    </>
  );
};

export default Sidebar;
