import type { RouteGroup, SiteRoute } from "@/types";

export const SITE = {
  name: "ORVANE",
  description:
    "ORVANE is a fictional electric performance car brand: a VIZAM portfolio concept with five models, a configurator and test-drive booking demo.",
  conceptLabel: "Concept project by VIZAM",
} as const;

export const routes = {
  home: { href: "/", label: "Home", description: "The ORVANE lineup at a glance.", group: "explore" },
  models: { href: "/models", label: "Models", description: "All five models side by side.", group: "models" },
  configure: { href: "/configure", label: "Configure", description: "Build your ORVANE and save it.", group: "connect" },
  technology: { href: "/technology", label: "Technology", description: "Battery, motors and software.", group: "explore" },
  innovation: { href: "/innovation", label: "Innovation", description: "What the engineering team is working on.", group: "explore" },
  performance: { href: "/performance", label: "Performance", description: "Chassis, power and control.", group: "explore" },
  design: { href: "/design", label: "Design", description: "The thinking behind the shape.", group: "brand" },
  story: { href: "/story", label: "Story", description: "Where ORVANE comes from.", group: "brand" },
  gallery: { href: "/gallery", label: "Gallery", description: "Studio and road imagery.", group: "brand" },
  contact: { href: "/contact", label: "Contact", description: "Questions, press and partnerships.", group: "connect" },
  testDrive: { href: "/test-drive", label: "Book a test drive", description: "Request a drive near you.", group: "connect" },
} as const satisfies Record<string, SiteRoute>;

export const modelRoutes: SiteRoute[] = [
  { href: "/models/aren", label: "Aren", description: "Grand touring sedan", group: "models" },
  { href: "/models/sola", label: "Sola", description: "Performance SUV", group: "models" },
  { href: "/models/vire", label: "Vire", description: "Two-door coupé", group: "models" },
  { href: "/models/tarn", label: "Tarn", description: "Electric pickup", group: "models" },
  { href: "/models/vanta", label: "Vanta", description: "Track coupé", group: "models" },
];

/** Desktop pill navigation. */
export const primaryNav: SiteRoute[] = [routes.models, routes.configure, routes.technology, routes.story];

export const groupLabels: Record<RouteGroup, string> = {
  models: "Models",
  explore: "Explore",
  brand: "Brand",
  connect: "Get in touch",
};

/** Full-screen menu and footer navigation, grouped. Every route appears here. */
export const navGroups: { group: RouteGroup; label: string; links: SiteRoute[] }[] = [
  { group: "models", label: groupLabels.models, links: [...modelRoutes, { ...routes.models, label: "All models" }] },
  {
    group: "explore",
    label: groupLabels.explore,
    links: [routes.home, routes.technology, routes.innovation, routes.performance],
  },
  { group: "brand", label: groupLabels.brand, links: [routes.design, routes.story, routes.gallery] },
  { group: "connect", label: groupLabels.connect, links: [routes.configure, routes.testDrive, routes.contact] },
];

/** Every static route plus model detail pages; used by tests and sitemap. */
export const allRoutePaths: string[] = [
  ...Object.values(routes).map((r) => r.href),
  ...modelRoutes.map((r) => r.href),
];
