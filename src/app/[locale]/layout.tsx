import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { SearchContextProvider } from "@/(contexts)/searchContext/page";
import '../globals.css';

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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <SearchContextProvider>
            <body>
              {children}
            </body>
          </SearchContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
