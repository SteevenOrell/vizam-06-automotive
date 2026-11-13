import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { isActivePath } from "@/lib/nav";
import { VehicleImage } from "./VehicleImage";

describe("VehicleImage", () => {
  it("renders the real image with alt text once the asset is delivered", () => {
    render(<VehicleImage slot="vire-view-side" />);
    const img = screen.getByRole("img", { name: /vire.*side profile/i });
    expect(img.getAttribute("src")).toContain("vire-view-side.webp");
    expect(img.hasAttribute("data-image-pending")).toBe(false);
  });

  it("falls back to 16 / 9 for unknown slots", () => {
    render(<VehicleImage slot="missing-slot" />);
    expect(screen.getByRole("img", { name: /missing-slot/ }).style.aspectRatio).toBe("16 / 9");
  });
});

describe("isActivePath", () => {
  it("matches the page and its children, home only exactly", () => {
    expect(isActivePath("/models/aren", "/models")).toBe(true);
    expect(isActivePath("/models", "/models")).toBe(true);
    expect(isActivePath("/modelsx", "/models")).toBe(false);
    expect(isActivePath("/story", "/")).toBe(false);
    expect(isActivePath(null, "/")).toBe(false);
  });
});
