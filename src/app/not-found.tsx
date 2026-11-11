import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This ORVANE page does not exist.",
};

export default function NotFound() {
  return (
    <PageHeader eyebrow="404" title="This road ends here." intro="The page you were looking for does not exist or has moved.">
      <div className="mt-10 flex flex-wrap gap-3">
        <LinkButton href="/" size="lg">
          Back to home
        </LinkButton>
        <LinkButton href="/models" variant="ghost" size="lg">
          See the models
        </LinkButton>
      </div>
    </PageHeader>
  );
}
