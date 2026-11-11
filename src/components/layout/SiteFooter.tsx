import Link from "next/link";
import { SITE, navGroups } from "@/data/site";
import { CONCEPT_DATA_NOTE } from "@/data/vehicles";
import { Container } from "@/components/ui/Layout";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-graphite bg-ink text-paper">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="ORVANE home" className="inline-flex min-h-11 items-center">
              <Wordmark />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Electric grand touring, performance SUV and coupé. Engineered calm, delivered quickly.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber">
              {SITE.conceptLabel}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {navGroups.map((group) => (
              <div key={group.group}>
                <h2 className="text-xs uppercase tracking-[0.24em] text-mist">{group.label}</h2>
                <ul className="mt-4 space-y-1">
                  {group.links.map((link) => (
                    <li key={`${group.group}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-sm text-paper/85 transition-colors duration-300 hover:text-amber sm:min-h-9"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-graphite pt-6 text-xs leading-relaxed text-mist md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl">{CONCEPT_DATA_NOTE}</p>
          <p className="shrink-0">© 2026 {SITE.name}. Fictional brand.</p>
        </div>
      </Container>
    </footer>
  );
}
