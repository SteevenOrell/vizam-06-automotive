import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORVANE (concept by VIZAM)",
    short_name: "ORVANE",
    description: "A fictional electric performance car brand: a VIZAM portfolio concept.",
    start_url: "/",
    display: "browser",
    background_color: "#0b0c0e",
    theme_color: "#0b0c0e",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
