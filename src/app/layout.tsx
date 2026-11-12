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

/**
 * Absolute base for Open Graph / canonical URLs. Set NEXT_PUBLIC_SITE_URL per deployment (no production domain is
 * hardcoded); it falls back to the local dev address.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3006";

/**
 * Runs before first paint: marks <html> so Reveal content may start hidden (only with JS on and motion not reduced),
 * and gives up on motion after 4s if GSAP has not loaded, so nothing can stay hidden.
 */
const motionGuard = `(function(){var d=document.documentElement;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-motion");setTimeout(function(){if(!window.__motionReady)d.classList.add("motion-failed")},4000)})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | Electric performance, concept by VIZAM`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  // Concept brand: keep search engines out. To allow indexing, change this and src/app/robots.ts together.
  robots: { index: false, follow: false },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_CA", title: `${SITE.name} | Electric performance, concept by VIZAM`, description: SITE.description, images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "ORVANE: a fictional electric performance car brand, a VIZAM concept project." }] },
  twitter: { card: "summary_large_image", title: `${SITE.name} | Electric performance, concept by VIZAM`, description: SITE.description, images: ["/twitter-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior="smooth": Next 16 then turns the CSS smooth scrolling off during route changes, so a new page
    // starts at the top instantly and Back restores the previous position (without it both animate from the old offset).
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${text.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGuard }} />
      </head>
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
