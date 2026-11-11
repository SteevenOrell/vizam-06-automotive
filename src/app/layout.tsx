import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, SiteHeaderView } from "@/components/layout/SiteHeader";
import { SITE } from "@/data/site";
import "./globals.css";

// next/font downloads these at build time and serves them from this site: no runtime Google requests.
const display = Archivo({
  variable: "--font-display-face",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const text = Inter({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Electric performance, concept by VIZAM`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} antialiased`}>
      <body>
        <div id="root">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Suspense fallback={<SiteHeaderView pathname={null} />}>
            <SiteHeader />
          </Suspense>
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
