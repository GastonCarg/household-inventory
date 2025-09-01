import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { SearchContextProvider } from "@/(contexts)/searchContext/page";
import "../globals.css";

export default async function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <NextIntlClientProvider>
          <SearchContextProvider>{children}</SearchContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}