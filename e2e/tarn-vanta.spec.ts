import { expect, test, type Locator, type Page } from "@playwright/test";

const heading = (page: Page) => page.locator("#step-heading");
const stageImg = (page: Page) => page.locator("[data-stage] img:not([alt=''])");
const next = (page: Page) => page.getByRole("button", { name: /^(Next|View summary)/ });

async function choose(input: Locator) {
  await input.locator("xpath=ancestor::label[1]").click();
  await expect(input).toBeChecked();
}

const MODELS = [
  { slug: "tarn", name: "Tarn", category: "Electric pickup", price: "98,000", trim: /Tarn Haul/, pkg: /^Bed Utility/, silver: /tarn-ext-lunar-silver/ },
  { slug: "vanta", name: "Vanta", category: "Track coupé", price: "235,000", trim: /Vanta Circuit/, pkg: /^Max Downforce|^Carbon Aero/, silver: /vanta-ext-lunar-silver/ },
] as const;

for (const m of MODELS) {
  test.describe(`/models/${m.slug}`, () => {
    test("renders the full page with its own content and no pending images", async ({ page }) => {
      await page.goto(`/models/${m.slug}`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading", { level: 1, name: m.name })).toBeVisible();
      await expect(page.getByText(m.category, { exact: true }).first()).toBeVisible();
      for (const id of ["exterior-title", "interior-title", "specs-title"]) await expect(page.locator(`#${id}`)).toBeAttached();
      await expect(page.locator("#main img[src='']")).toHaveCount(0);
      // Paint and cabin switchers carry every option.
      await expect(page.getByRole("group", { name: `${m.name} exterior paint` }).getByRole("button")).toHaveCount(5);
      await expect(page.getByRole("group", { name: `${m.name} interior trim` }).getByRole("button")).toHaveCount(3);
      await expect(page.getByText("Image pending")).toHaveCount(0);
      const pager = page.getByRole("navigation", { name: "More models" });
      await expect(pager.getByRole("link")).toHaveCount(2);
    });

    for (const width of [390, 1440]) {
      test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/models/${m.slug}`);
        await page.waitForLoadState("networkidle");
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      });
    }

    test(`configurator deep link ?model=${m.slug} completes a configuration`, async ({ page }) => {
      await page.goto(`/configure?model=${m.slug}`);
      await expect(page.getByRole("radio", { name: new RegExp(`${m.name} From`) })).toBeChecked();
      await expect(page.getByTestId("concept-price").first()).toContainText(m.price);
      await next(page).click(); // trim
      await choose(page.getByRole("radio", { name: m.trim }));
      await next(page).click(); // colour
      await expect(heading(page)).toHaveText(/colour/i);
      await expect(page.getByRole("radio", { name: /^Lunar Silver/ })).toBeChecked();
      await expect(stageImg(page)).toHaveAttribute("src", m.silver);
      await choose(page.getByRole("radio", { name: /^Ember/ }));
      await expect(stageImg(page)).toHaveAttribute("src", new RegExp(`${m.slug}-ext-ember`));
      await next(page).click(); // wheels
      await choose(page.getByRole("radio", { name: /^Forge/ }));
      await next(page).click(); // interior
      await choose(page.getByRole("radio", { name: /^Dune/ }));
      await expect(stageImg(page)).toHaveAttribute("src", new RegExp(`${m.slug}-int-dune`));
      await next(page).click(); // packages
      await expect(heading(page)).toHaveText(/packages/i);
      await choose(page.getByRole("checkbox", { name: m.slug === "tarn" ? /^Bed Utility/ : /^Road Comfort/ }));
      await next(page).click(); // summary
      const summary = page.locator("#config-summary");
      await expect(summary).toContainText(m.trim.source.replace(/\\/g, ""));
      await expect(summary).toContainText("Ember");
      await expect(summary).toContainText("Dune");
      await expect(summary).toContainText("Forge");
      await expect(page.locator(`a[href="/test-drive?model=${m.slug}"]`).first()).toBeVisible();
    });
  });
}

test("Tarn has no Front view; Vanta has all four", async ({ page }) => {
  await page.goto("/configure?model=tarn&step=colour");
  await expect(page.getByRole("radio", { name: "Rear 3/4" })).toBeEnabled();
  await expect(page.getByRole("radio", { name: "Front", exact: true })).toBeDisabled();
  await page.goto("/configure?model=vanta&step=colour");
  await expect(page.getByRole("radio", { name: "Front", exact: true })).toBeEnabled();
});

test("model pages and lineup list all five models", async ({ page }) => {
  await page.goto("/models");
  await page.waitForLoadState("networkidle");
  for (const name of ["Aren", "Sola", "Vire", "Tarn", "Vanta"]) {
    await expect(page.getByRole("heading", { level: 2, name, includeHidden: true })).toHaveCount(1);
  }
  await page.goto("/test-drive?model=vanta");
  await expect(page.getByLabel("Vehicle model")).toHaveValue("vanta");
  await expect(page.getByLabel("Vehicle model").locator("option", { hasText: "Tarn" })).toHaveCount(1);
});

test("gallery has Tarn and Vanta filter chips with images", async ({ page }) => {
  await page.goto("/gallery");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: /^Tarn/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /^Vanta/ }).first()).toBeVisible();
});
