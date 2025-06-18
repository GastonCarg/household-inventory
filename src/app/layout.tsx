import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SearchContextProvider } from "../(contexts)/searchContext/page";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventario de Casa",
  description: "Inventario para tener control de los productos de tu casa",
};

// TODO: add header and footer
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SearchContextProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </SearchContextProvider>
    </html>
  );
}
