import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { isActivePath } from "@/lib/nav";
import { VehicleImage } from "./VehicleImage";

describe("VehicleImage", () => {
  it("renders a labelled placeholder at the slot's aspect ratio while the asset is pending", () => {
    render(<VehicleImage slot="vire-view-side" />);
    const img = screen.getByRole("img", { name: /vire.*image pending/i });
    expect(img.getAttribute("data-image-pending")).toBe("vire-view-side");
    expect(img.style.aspectRatio).toBe("2400 / 1350");
    expect(img.textContent).toMatch(/Vire/);
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
