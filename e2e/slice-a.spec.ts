import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

const noOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe("home", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("hero CTAs navigate to the model and the configurator", async ({ page }) => {
    await ready(page, "/");
    const hero = page.getByRole("region", { name: "ORVANE Aren" });
    await expect(hero.getByRole("link", { name: "Explore Aren" })).toHaveAttribute("href", "/models/aren");
    await expect(hero.getByRole("link", { name: "Configure" })).toHaveAttribute("href", "/configure?model=aren");
    await hero.getByRole("link", { name: "Explore Aren" }).click();
    await expect(page).toHaveURL(/\/models\/aren$/);

    await ready(page, "/");
    await page.getByRole("region", { name: "ORVANE Aren" }).getByRole("link", { name: "Configure" }).click();
    await expect(page).toHaveURL(/\/configure\?model=aren$/);
  });

  test("hero image is eager with high priority and everything below the fold is lazy", async ({ page }) => {
    await ready(page, "/");
    const hero = page.locator("section[aria-label='ORVANE Aren'] img");
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    const eagerBelow = await page.locator("main img:not([loading='lazy']), #root img:not([loading='lazy'])").count();
    expect(eagerBelow).toBeLessThanOrEqual(1);
  });

  test("model cards link to the detail and configure pages", async ({ page }) => {
    await ready(page, "/");
    for (const slug of ["aren", "sola", "vire"]) {
      const card = page.locator("article", { has: page.locator(`a[href="/models/${slug}"]`) });
      await expect(card).toHaveCount(1);
      await expect(card.locator(`a[href="/configure?model=${slug}"]`)).toHaveCount(1);
    }
    await page.locator("article a[href='/models/sola']").first().click();
    await expect(page).toHaveURL(/\/models\/sola$/);
  });

  test("model cards have equal height", async ({ page }) => {
    await ready(page, "/");
    const heights = await page.locator("article").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(heights).toHaveLength(3);
    expect(new Set(heights).size).toBe(1);
  });
});

test.describe("models page", () => {
  test("lists three panels and an accessible comparison table", async ({ page }) => {
    await ready(page, "/models");
    await expect(page.getByRole("heading", { level: 2, name: /^(Aren|Sola|Vire)$/, includeHidden: true })).toHaveCount(3);
    const table = page.getByRole("table", { name: /Concept specifications of the ORVANE Aren, Sola and Vire/ });
    await expect(table.getByRole("columnheader")).toHaveCount(3);
    await expect(table.getByRole("rowheader").first()).toBeVisible();
    await expect(page.locator("div[role='region'][aria-labelledby='compare-title']")).toBeVisible();
  });

  test("comparison table scrolls inside its own region at 390px, not the page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, "/models");
    const region = page.locator("div[role='region'][aria-labelledby='compare-title']");
    const { scrollWidth, clientWidth } = await region.evaluate((el) => ({ scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    expect(await noOverflow(page)).toBeLessThanOrEqual(0);
  });
});

test.describe("model page /models/aren", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("exterior colour switcher changes the image and aria-pressed", async ({ page }) => {
    await ready(page, "/models/aren");
    const group = page.getByRole("group", { name: "Aren exterior paint" });
    const silver = group.getByRole("button", { name: /Lunar Silver/ });
    const black = group.getByRole("button", { name: /Basalt Black/ });
    await expect(silver).toHaveAttribute("aria-pressed", "true");
    await expect(black).toHaveAttribute("aria-pressed", "false");

    await black.click();
    await expect(black).toHaveAttribute("aria-pressed", "true");
    await expect(silver).toHaveAttribute("aria-pressed", "false");
    const shown = page.locator("section[aria-labelledby='exterior-title'] img[alt*='Basalt Black']");
    await expect(shown).toHaveCount(1);
    await expect(shown).toHaveAttribute("src", /aren-ext-basalt-black/);
    await expect(shown).toHaveCSS("opacity", "1");
  });

  test("hovering a swatch preloads its image without selecting it", async ({ page }) => {
    await ready(page, "/models/aren");
    expect(await page.locator("img[src*='aren-ext-ember']").count()).toBe(0);
    await page.getByRole("group", { name: "Aren exterior paint" }).getByRole("button", { name: /Ember/ }).hover();
    await expect(page.locator("img[src*='aren-ext-ember']")).toHaveCount(1);
    await expect(page.getByRole("group", { name: "Aren exterior paint" }).getByRole("button", { name: /Lunar Silver/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("interior trim switcher works", async ({ page }) => {
    await ready(page, "/models/aren");
    const group = page.getByRole("group", { name: "Aren interior trim" });
    await expect(group.getByRole("button", { name: /Onyx/ })).toHaveAttribute("aria-pressed", "true");
    await group.getByRole("button", { name: /Dune/ }).click();
    await expect(group.getByRole("button", { name: /Dune/ })).toHaveAttribute("aria-pressed", "true");
    await expect(group.getByRole("button", { name: /Onyx/ })).toHaveAttribute("aria-pressed", "false");
    const shown = page.locator("section[aria-labelledby='interior-title'] img[alt*='Dune']");
    await expect(shown).toHaveAttribute("src", /aren-int-dune/);
  });

  test("hotspot opens and closes with the keyboard", async ({ page }) => {
    await ready(page, "/models/aren");
    const hotspot = page.getByRole("button", { name: /Feature 1: Full-width light signature/ });
    await hotspot.scrollIntoViewIfNeeded();
    await hotspot.focus();
    await page.keyboard.press("Enter");
    await expect(hotspot).toHaveAttribute("aria-expanded", "true");
    const popover = page.getByRole("group", { name: "Full-width light signature" });
    await expect(popover).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(hotspot).toHaveAttribute("aria-expanded", "false");
    await expect(popover).toBeHidden();
    await expect(hotspot).toBeFocused();
  });

  test("gallery works with keyboard and buttons and never scrolls the page sideways", async ({ page }) => {
    await ready(page, "/models/aren");
    const gallery = page.getByRole("region", { name: "Aren image gallery" });
    await gallery.scrollIntoViewIfNeeded();
    const counter = page.getByText(/^\d\d \/ 06/);
    await expect(counter).toContainText("01 / 06");
    await expect(page.getByRole("button", { name: "Previous image" })).toBeDisabled();

    await gallery.focus();
    await page.keyboard.press("ArrowRight");
    await expect(counter).toContainText("02 / 06");
    await page.keyboard.press("ArrowLeft");
    await expect(counter).toContainText("01 / 06");

    await page.getByRole("button", { name: "Next image" }).click();
    await expect(counter).toContainText("02 / 06");
    await page.getByRole("button", { name: "Previous image" }).click();
    await expect(counter).toContainText("01 / 06");

    await gallery.focus();
    await page.keyboard.press("End");
    await expect(counter).toContainText("06 / 06");
    await expect(page.getByRole("button", { name: "Next image" })).toBeDisabled();
    expect(await noOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("CTAs and pager link to the right places", async ({ page }) => {
    await ready(page, "/models/aren");
    await expect(page.getByRole("link", { name: "Configure Aren" })).toHaveAttribute("href", "/configure?model=aren");
    await expect(page.getByRole("link", { name: "Book a test drive" }).first()).toHaveAttribute("href", "/test-drive?model=aren");
    const pager = page.getByRole("navigation", { name: "More models" });
    await expect(pager.getByRole("link", { name: /Previous model/ })).toHaveAttribute("href", "/models/vire");
    await expect(pager.getByRole("link", { name: /Next model/ })).toHaveAttribute("href", "/models/sola");
  });
});

test.describe("hotspots hidden on phones, list shown", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("numbered list replaces hotspots at 390px", async ({ page }) => {
    await ready(page, "/models/aren");
    await expect(page.getByRole("button", { name: /Feature 1:/ })).toBeHidden();
    await expect(page.getByRole("heading", { level: 4, name: "Full-width light signature" })).toBeVisible();
  });
});

for (const width of [390, 1440]) {
  test.describe(`no horizontal overflow at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const path of ["/", "/models", "/models/aren", "/models/sola", "/models/vire"]) {
      test(path, async ({ page }) => {
        await ready(page, path);
        expect(await noOverflow(page)).toBeLessThanOrEqual(0);
      });
    }
  });
}
