import { routing } from '@/i18n/routing';
import { Sidebar } from '@/components';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Figtree, Nunito, Syne } from 'next/font/google';
import { notFound } from 'next/navigation';

import { ItemModalProvider, SearchContextProvider } from '@/(contexts)';
import '@/app/globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-figtree',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-nunito',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${figtree.variable} ${nunito.variable} ${syne.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#090A0F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <ItemModalProvider>
            <SearchContextProvider>
              <div className="flex min-h-screen bg-transparent lg:items-stretch">
                <Sidebar />
                <main className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-0">
                  {children}
                </main>
              </div>
            </SearchContextProvider>
          </ItemModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
