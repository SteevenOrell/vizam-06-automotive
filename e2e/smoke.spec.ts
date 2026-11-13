import { expect, test } from "@playwright/test";

const ROUTES: { path: string; h1: RegExp }[] = [
  { path: "/", h1: /electric performance/i },
  { path: "/models", h1: /three ways/i },
  { path: "/models/aren", h1: /^aren$/i },
  { path: "/models/sola", h1: /^sola$/i },
  { path: "/models/vire", h1: /^vire$/i },
  { path: "/configure", h1: /configure your orvane/i },
  { path: "/technology", h1: /engineered/i },
  { path: "/innovation", h1: /four questions/i },
  { path: "/performance", h1: /quick, and never in a hurry/i },
  { path: "/design", h1: /shape follows composure/i },
  { path: "/story", h1: /quieter idea/i },
  { path: "/gallery", h1: /studio and road/i },
  { path: "/contact", h1: /request information/i },
  { path: "/test-drive", h1: /book a test drive/i },
];

for (const { path, h1 } of ROUTES) {
  test(`renders ${path} with one h1 and the concept label`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const headings = page.locator("h1");
    await expect(headings).toHaveCount(1);
    await expect(headings).toHaveText(h1);
    await expect(page.locator("#root")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toContainText("Concept project by VIZAM");
  });
}

test("unknown routes and model slugs return 404", async ({ page }) => {
  expect((await page.goto("/does-not-exist"))?.status()).toBe(404);
  expect((await page.goto("/models/unknown"))?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText(/road ends here/i);
});

test.describe("mobile menu at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, traps focus, closes with Esc and with the close button", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Menu" });
    const dialog = page.getByRole("dialog", { name: "Site menu" });

    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(dialog).toBeHidden();

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

    // Every route is reachable from the overlay.
    for (const href of ["/models/aren", "/models/sola", "/models/vire", "/technology", "/innovation", "/performance", "/design", "/story", "/gallery", "/configure", "/test-drive", "/contact"]) {
      await expect(dialog.locator(`a[href="${href}"]`)).toHaveCount(1);
    }

    // Shift+Tab from the first control wraps inside the dialog.
    await dialog.getByRole("link", { name: "ORVANE home" }).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");

    await menuButton.click();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
  });

  test("menu link navigates and closes the overlay", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Site menu" }).getByRole("link", { name: "Technology" }).click();
    await expect(page).toHaveURL(/\/technology$/);
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });

  test("no horizontal scroll at 390px", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("250px lock", () => {
  test.use({ viewport: { width: 240, height: 700 } });

  test("#root and fixed header lock to 500px", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("#root").evaluate((el) => el.getBoundingClientRect().width)).toBe(500);
    expect(await page.locator("header[data-fixed]").evaluate((el) => el.getBoundingClientRect().width)).toBe(500);
  });
});
