import { SearchContextProvider } from "../(contexts)/searchContext/page";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <SearchContextProvider>
        <body>{children}</body>
      </SearchContextProvider>
    </html>
  );
}
