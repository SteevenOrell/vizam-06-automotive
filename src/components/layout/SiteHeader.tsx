"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { primaryNav, routes } from "@/data/site";
import { cn } from "@/lib/cn";
import { isActivePath } from "@/lib/nav";
import { SiteMenu } from "./SiteMenu";
import { Wordmark } from "./Wordmark";

const pill = "rounded-full bg-ink/90 text-paper shadow-[0_8px_30px_rgb(0_0_0/0.25)] ring-1 ring-paper/10 backdrop-blur-md";

/**
 * Fixed header built from floating dark pills (reference 03) so it stays legible over light and dark sections.
 * Desktop: wordmark, centred pill nav, test-drive link and menu button. Phone: wordmark and menu button.
 */
export function SiteHeader() {
  return <SiteHeaderView pathname={usePathname()} />;
}

/**
 * Header without the router hook, used as the Suspense fallback while the pathname is unknown during
 * prerendering (Cache Components). Active-link highlighting is simply off in that state.
 */
export function SiteHeaderView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header data-fixed className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <Link href="/" aria-label="ORVANE home" className={cn(pill, "flex min-h-11 items-center px-5")}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className={cn(pill, "flex items-center gap-1 p-1")}>
              {primaryNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-10 items-center rounded-full px-5 text-sm transition-colors duration-300",
                        active ? "bg-paper text-ink" : "text-paper/85 hover:text-paper hover:bg-paper/10",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={routes.testDrive.href}
              className={cn(
                pill,
                "hidden min-h-11 items-center px-5 text-sm transition-colors duration-300 hover:bg-amber hover:text-ink md:flex",
              )}
            >
              Test drive
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              className={cn(pill, "flex min-h-11 items-center gap-2 px-5 text-sm transition-colors duration-300 hover:bg-carbon")}
            >
              <Menu aria-hidden="true" className="size-4" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      <SiteMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
