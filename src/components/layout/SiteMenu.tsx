"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { SITE, navGroups } from "@/data/site";
import { cn } from "@/lib/cn";
import { isActivePath } from "@/lib/nav";
import { Wordmark } from "./Wordmark";

interface SiteMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen menu listing every route. Modal dialog: focus moves in and is trapped, Esc closes,
 * page scroll is locked while open, and focus returns to the menu button (handled by the header).
 */
export function SiteMenu({ open, onClose, pathname }: SiteMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  let itemIndex = 0;
  return (
    <div
      ref={dialogRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
      data-fixed
      className="fixed inset-0 z-50 overflow-y-auto bg-ink text-paper"
    >
      <div className="mx-auto flex min-h-full max-w-[1440px] flex-col px-5 pb-10 pt-3 sm:px-8 sm:pt-4 lg:px-12">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" onClick={onClose} aria-label="ORVANE home" className="flex min-h-11 items-center px-2">
            <Wordmark />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex min-h-11 items-center gap-2 rounded-full px-5 text-sm ring-1 ring-paper/25 transition-colors duration-300 hover:bg-paper/10"
          >
            <X aria-hidden="true" className="size-4" />
            <span>Close</span>
          </button>
        </div>

        <nav aria-label="All pages" className="mt-12 grid flex-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {navGroups.map((group) => (
            <div key={group.group}>
              <h2 className="text-xs uppercase tracking-[0.24em] text-mist">{group.label}</h2>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => {
                  const active = isActivePath(pathname, link.href) && (link.href !== "/models" || pathname === "/models");
                  return (
                    <li key={`${group.group}-${link.href}`} className="menu-item" style={{ "--i": itemIndex++ } as CSSProperties}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group inline-flex min-h-11 items-baseline gap-3 py-1 font-display text-2xl font-semibold [font-stretch:112%] transition-colors duration-300 md:text-3xl",
                          active ? "text-amber" : "text-paper hover:text-amber",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <p className="mt-12 border-t border-graphite pt-6 text-xs uppercase tracking-[0.24em] text-mist">{SITE.conceptLabel}</p>
      </div>
    </div>
  );
}
