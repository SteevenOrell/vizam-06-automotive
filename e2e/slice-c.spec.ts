import { expect, test, type Page } from "@playwright/test";
import { vehicles } from "../src/data/vehicles";
import { headlineStats } from "../src/lib/vehicle-stats";

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

const PAGES = [
  { path: "/technology", h1: /engineered to stay out of the way/i, cta: ["/test-drive", "/configure"] },
  { path: "/innovation", h1: /four questions/i, cta: ["/test-drive", "/configure"] },
  { path: "/performance", h1: /quick, and never in a hurry/i, cta: ["/test-drive?model=vire", "/configure?model=vire"] },
  { path: "/design", h1: /shape follows composure/i, cta: ["/test-drive", "/configure"] },
  { path: "/story", h1: /quieter idea/i, cta: ["/models", "/test-drive"] },
];

for (const { path, h1, cta } of PAGES) {
  test.describe(path, () => {
    test("has its h1, closing CTAs and no pending images", async ({ page }) => {
      await open(page, path);
      await expect(page.locator("h1")).toHaveText(h1);
      for (const href of cta) await expect(page.locator(`#main a[href="${href}"]`).first()).toBeAttached();
      await expect(page.locator("[data-image-pending]")).toHaveCount(0);
    });

    for (const width of [390, 1440]) {
      test(`no horizontal overflow at ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await open(page, path);
        expect(await overflow(page)).toBe(0);
      });
    }

    test("content is complete under reduced motion", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await open(page, path);
      for (const h of await page.locator("#main h2").all()) await expect(h).toBeVisible();
    });
  });
}

test.describe("technology: platform explorer", () => {
  test("is operable by keyboard and swaps the panel", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/technology");
    const tabs = page.getByRole("tablist", { name: "Platform systems" }).getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(page.getByRole("tabpanel", { name: "Motors" })).toBeVisible();
    await expect(page.getByRole("tabpanel", { name: "Motors" })).toContainText("One, two or three motors");
    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel", { name: "Software" })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Home");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    // Only the selected tab is in the tab order.
    await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
    await tabs.nth(2).click();
    await expect(page.getByRole("img", { name: /coolant loop/i })).toBeVisible();
  });
});

test.describe("performance: model switcher", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("figures follow the vehicle data for every model and trim", async ({ page }) => {
    await open(page, "/performance");
    const figures = page.getByTestId("switcher-figures");
    const expectStats = async (specs: (typeof vehicles)[number]["specs"]) => {
      for (const s of headlineStats(specs)) {
        await expect(figures).toContainText(s.value);
        await expect(figures).toContainText(s.label);
      }
    };
    for (const v of vehicles) {
      const modelBtn = page.getByRole("group", { name: "Model" }).getByRole("button", { name: v.name, exact: true });
      await modelBtn.focus();
      await page.keyboard.press("Enter");
      await expect(modelBtn).toHaveAttribute("aria-pressed", "true");
      for (const trim of v.trims) {
        await page.getByRole("group", { name: `${v.name} trim` }).getByRole("button", { name: trim.name, exact: true }).click();
        await expect(figures).toContainText(trim.name);
        await expectStats(trim.specs);
      }
    }
  });

  test("comparison table matches the data", async ({ page }) => {
    await open(page, "/performance");
    const table = page.getByRole("table");
    for (const v of vehicles) {
      const row = table.getByRole("row", { name: new RegExp(v.name) });
      await expect(row).toContainText(`${v.specs.zeroToHundredS.toFixed(1)} s`);
      await expect(row).toContainText(`${v.specs.rangeKm} km`);
    }
  });
});

test.describe("design", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("silhouette strip buttons move through the slides", async ({ page }) => {
    await open(page, "/design");
    const prev = page.getByRole("button", { name: "Previous image" });
    const next = page.getByRole("button", { name: "Next image" });
    await expect(prev).toBeDisabled();
    await next.scrollIntoViewIfNeeded();
    await next.click();
    await expect(page.getByText("02", { exact: true }).first()).toBeVisible();
    await expect(prev).toBeEnabled();
  });

  test("palette lists every paint and interior by name", async ({ page }) => {
    await open(page, "/design");
    for (const c of vehicles[0].colours) await expect(page.getByText(c.name, { exact: true }).first()).toBeAttached();
    for (const i of vehicles[0].interiors) await expect(page.getByText(i.name, { exact: true }).first()).toBeAttached();
  });
});

test.describe("story", () => {
  test("shows the concept narrative note and five chapters", async ({ page }) => {
    await open(page, "/story");
    await expect(page.locator("[data-concept-narrative]")).toContainText("Concept narrative");
    await expect(page.getByText(/^Chapter /)).toHaveCount(5);
  });
});

test.describe("innovation", () => {
  test("every research theme is present at phone width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, "/innovation");
    for (const name of ["Aerodynamics", "Light engineering", "Materials and circularity", "Evolution over the air"]) {
      await expect(page.getByRole("heading", { name, level: 3 })).toBeVisible();
    }
  });
});
