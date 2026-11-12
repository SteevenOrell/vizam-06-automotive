"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { navGroups, primaryNav, routes } from "@/data/site";
import { cn } from "@/lib/cn";
import { isActivePath } from "@/lib/nav";
import { SiteMenu } from "./SiteMenu";
import { Wordmark } from "./Wordmark";

const REDUCED = "(prefers-reduced-motion: reduce)";

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
  const [hidden, setHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // The page the visitor is on when it has no pill of its own (Innovation, Gallery...): shown on the Menu button.
  const inPills = primaryNav.some((item) => isActivePath(pathname, item.href)) || pathname === routes.testDrive.href;
  const currentLabel =
    !inPills && pathname && pathname !== "/"
      ? navGroups.flatMap((g) => g.links).find((l) => l.href !== "/models" && isActivePath(pathname, l.href))?.label
      : undefined;

  // Calm hide-on-scroll-down / show-on-scroll-up. Never hides while the menu is open, while focus is inside the header,
  // near the top of the page, or under prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (y < 160 || delta < -6) setHidden(false);
      else if (delta > 10 && !headerRef.current?.contains(document.activeElement)) setHidden(true);
      if (Math.abs(delta) > 6) last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Short page fade after a route change (CSS in globals.css). Runs before paint so the new page never flashes at full
  // opacity first; skipped on first load and under reduced motion. replaceState on one route (configurator) keeps the pathname.
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (pathname === null || window.matchMedia(REDUCED).matches) return;
    const root = document.documentElement;
    root.setAttribute("data-nav", "");
    const timer = window.setTimeout(() => root.removeAttribute("data-nav"), 500);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-fixed
        data-hidden={hidden && !open ? "" : undefined}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-40 px-3 pt-3 transition-transform duration-300 ease-out data-[hidden]:-translate-y-[130%] sm:px-5 sm:pt-4"
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="ORVANE home"
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(pill, "flex min-h-11 items-center px-5")}
          >
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
              aria-current={pathname === routes.testDrive.href ? "page" : undefined}
              className={cn(
                pill,
                "hidden min-h-11 items-center px-5 text-sm transition-colors duration-300 hover:bg-amber hover:text-ink md:flex",
                pathname === routes.testDrive.href && "bg-amber text-ink",
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
              {currentLabel ? (
                <>
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-amber" />
                  <span className="sr-only">(current page: {currentLabel})</span>
                </>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <SiteMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
