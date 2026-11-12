import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/models",
  "/models/aren",
  "/models/sola",
  "/models/vire",
  "/configure",
  "/technology",
  "/innovation",
  "/performance",
  "/design",
  "/story",
  "/gallery",
  "/contact",
  "/test-drive",
  "/does-not-exist",
];

// Motion is reduced so every section is visible to axe (Reveal content is hidden until scrolled otherwise).
test.use({ reducedMotion: "reduce" });

for (const width of [390, 1440]) {
  for (const path of ROUTES) {
    test(`axe: no serious or critical violations on ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.waitForLoadState("load");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
}

test("landmarks, one h1 and heading order on every route", async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of ROUTES) {
    await page.goto(path);
    expect(await page.locator("main").count(), `${path}: one main`).toBe(1);
    expect(await page.locator("h1").count(), `${path}: one h1`).toBe(1);
    const levels = await page.$$eval("h1,h2,h3,h4", (els) => els.map((e) => Number(e.tagName[1])));
    levels.forEach((l, i) => {
      if (i > 0) expect(l - levels[i - 1], `${path}: heading jump at index ${i}`).toBeLessThanOrEqual(1);
    });
  }
});

test("skip link moves focus to main on every page", async ({ page }) => {
  for (const path of ["/", "/models/aren", "/configure", "/gallery", "/contact", "/does-not-exist"]) {
    await page.goto(path);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" }), path).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main"), path).toBeFocused();
  }
});
