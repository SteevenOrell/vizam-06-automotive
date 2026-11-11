import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { TwoTone } from "@/components/ui/Typography";
import { routes } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "ORVANE | Electric performance, concept by VIZAM" },
  description:
    "ORVANE is a fictional electric performance car brand: grand touring sedan, performance SUV and coupé. A VIZAM portfolio concept.",
};

// Stub: Slice A builds the full homepage (hero stage, hotspots, stat row, lineup).
export default function HomePage() {
  return (
    <PageHeader
      eyebrow="Electric performance"
      title={<TwoTone muted="The calm side of" strong="electric performance." />}
      intro="Three concept models, one engineering idea: power that stays composed."
    >
      <div className="mt-10 flex flex-wrap gap-3">
        <LinkButton href={routes.models.href} size="lg">
          Explore models
        </LinkButton>
        <LinkButton href={routes.configure.href} variant="ghost" size="lg">
          Configure
        </LinkButton>
      </div>
    </PageHeader>
  );
}
