import { expect, test, type Page } from "@playwright/test";
import { getDefaultConfig, serializeSaved } from "../src/lib/configurator";
import { isoDateAfter } from "../src/lib/schemas";

const ORIGIN = "http://localhost:3006";
const DEMO = /Demonstration only: your request was validated but not sent or stored\. ORVANE is a fictional brand created by VIZAM\./;

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

const alertOf = (page: Page) => page.locator('#main [role="alert"]');
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const futureDate = (days = 10) => isoDateAfter(new Date(), days);

async function fillDrive(page: Page, overrides: Partial<Record<"name" | "email" | "phone" | "date" | "place" | "message", string>> = {}) {
  await page.getByLabel(/^Name/).fill(overrides.name ?? "Alex Example");
  await page.getByLabel(/^Email/).fill(overrides.email ?? "alex@example.com");
  await page.getByLabel(/^Phone/).fill(overrides.phone ?? "");
  await page.getByLabel(/^Vehicle model/).selectOption("sola");
  await page.getByLabel(/^Preferred date/).fill(overrides.date ?? futureDate());
  await page.getByLabel(/^Preferred location/).fill(overrides.place ?? "Toronto");
  await page.getByLabel(/^Message/).fill(overrides.message ?? "");
}

test.describe("/test-drive", () => {
  test("empty submit shows a focused error summary with inline errors", async ({ page }) => {
    await open(page, "/test-drive");
    await page.getByRole("button", { name: "Request a test drive" }).click();
    const summary = alertOf(page);
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("problems with your request");
    for (const label of ["Name", "Email", "Vehicle model", "Preferred date", "Preferred location"]) {
      await expect(summary.getByRole("link", { name: new RegExp(`^${label}:`) })).toBeVisible();
    }
    const name = page.getByLabel(/^Name/);
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription(/Please enter your name/);
    // The link in the summary moves focus to the field.
    await summary.getByRole("link", { name: /^Email:/ }).click();
    await expect(page.getByLabel(/^Email/)).toBeFocused();
  });

  test("fixing the fields shows the demonstration success panel, and Start again resets", async ({ page }) => {
    await open(page, "/test-drive");
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(alertOf(page)).toBeVisible();
    await fillDrive(page);
    await page.getByRole("button", { name: "Request a test drive" }).click();
    const panel = page.getByRole("status").filter({ hasText: "This was a demonstration" });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(DEMO);
    await expect(panel).toContainText("ORVANE Sola");
    await expect(alertOf(page)).toHaveCount(0);
    await page.getByRole("button", { name: "Start again" }).click();
    await expect(page.getByLabel(/^Name/)).toBeFocused();
    await expect(page.getByLabel(/^Name/)).toHaveValue("");
  });

  test("a notice before the submit button says the same", async ({ page }) => {
    await open(page, "/test-drive");
    await expect(page.getByText(/Demonstration only: your request will be validated but not sent or stored/)).toBeVisible();
    await expect(page.getByText(/no real locations/i)).toBeVisible();
  });

  test("?model=vire preselects the model and its image", async ({ page }) => {
    await open(page, "/test-drive?model=vire");
    await expect(page.getByLabel(/^Vehicle model/)).toHaveValue("vire");
    await expect(page.getByRole("complementary", { name: "Selected model" })).toContainText("ORVANE Vire");
    await open(page, "/test-drive?model=nonsense");
    await expect(page.getByLabel(/^Vehicle model/)).toHaveValue("");
  });

  test("a past date and a date beyond six months are rejected", async ({ page }) => {
    await open(page, "/test-drive");
    await fillDrive(page, { date: isoDateAfter(new Date(), -2) });
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(page.getByLabel(/^Preferred date/)).toHaveAttribute("aria-invalid", "true");
    await expect(alertOf(page)).toContainText("today or a later date");
    await page.getByLabel(/^Preferred date/).fill(isoDateAfter(new Date(), 400));
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(alertOf(page)).toContainText("within the next six months");
    await expect(page.getByLabel(/^Preferred date/)).toHaveAttribute("min", /^\d{4}-\d{2}-\d{2}$/);
  });

  test("validates a field on blur", async ({ page }) => {
    await open(page, "/test-drive");
    const email = page.getByLabel(/^Email/);
    await email.fill("not-an-email");
    await email.blur();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#td-email-error")).toContainText("valid email");
    await email.fill("ok@example.com");
    await email.blur();
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
  });

  test("the server still rejects invalid data when the browser does not validate (JavaScript off)", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL: ORIGIN });
    const page = await context.newPage();
    await page.goto("/test-drive");
    await page.locator("#td-name:visible").fill("Alex Example");
    await page.locator("#td-email:visible").fill("definitely not an email");
    await page.locator("#td-preferredDate:visible").fill(isoDateAfter(new Date(), -30));
    await page.locator("#td-preferredLocation:visible").fill("Toronto");
    await page.locator("#td-model:visible").selectOption("aren");
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(alertOf(page)).toContainText("Email: Please enter a valid email address.");
    await expect(alertOf(page)).toContainText("Preferred date");
    // The submitted text is put back so nothing has to be retyped.
    await expect(page.locator("#td-name:visible")).toHaveValue("Alex Example");
    await expect(page.locator("#td-email:visible")).toHaveValue("definitely not an email");
    // No personal data in the URL.
    expect(page.url()).not.toContain("Alex");
    expect(new URL(page.url()).search).toBe("");
    await context.close();
  });

  test("a valid request also passes the server with JavaScript off", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL: ORIGIN });
    const page = await context.newPage();
    await page.goto("/test-drive");
    await page.locator("#td-name:visible").fill("Alex Example");
    await page.locator("#td-email:visible").fill("alex@example.com");
    await page.locator("#td-preferredDate:visible").fill(futureDate());
    await page.locator("#td-preferredLocation:visible").fill("Toronto");
    await page.locator("#td-model:visible").selectOption("aren");
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(page.getByRole("status")).toContainText(DEMO);
    await context.close();
  });

  test("a honeypot hit gets the generic success without detail", async ({ page }) => {
    await open(page, "/test-drive");
    await fillDrive(page);
    await page.evaluate(() => {
      (document.querySelector('input[name="website"]') as HTMLInputElement).value = "http://spam.example";
    });
    await page.getByRole("button", { name: "Request a test drive" }).click();
    const panel = page.getByRole("status").filter({ hasText: "This was a demonstration" });
    await expect(panel).toBeVisible();
    await expect(panel.locator("dl")).toHaveCount(0);
    await expect(panel).not.toContainText("spam.example");
  });

  test("the saved-configuration checkbox appears only when a build is saved on this device", async ({ page }) => {
    await open(page, "/test-drive");
    await expect(page.getByLabel("Attach my saved configuration")).toHaveCount(0);

    const saved = serializeSaved(getDefaultConfig("sola"));
    await page.addInitScript((value) => window.localStorage.setItem("orvane.configurator.v1", value), saved);
    await open(page, "/test-drive");
    const attach = page.getByLabel("Attach my saved configuration");
    await expect(attach).toBeVisible();
    await expect(attach).not.toBeChecked();
    await expect(page.getByTestId("saved-summary")).toContainText("ORVANE Sola");

    // Unticked: not part of the validated request.
    await fillDrive(page);
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(page.getByRole("status").filter({ hasText: "This was a demonstration" })).toContainText("Not attached");
    await page.getByRole("button", { name: "Start again" }).click();

    // Ticked: included and validated.
    await fillDrive(page);
    await page.getByLabel("Attach my saved configuration").check();
    await page.getByRole("button", { name: "Request a test drive" }).click();
    const panel = page.getByRole("status").filter({ hasText: "This was a demonstration" });
    await expect(panel).toContainText("Saved configuration");
    await expect(panel).not.toContainText("Not attached");
    await expect(panel).toContainText("concept price");
  });

  test("no request leaves the origin during a submit", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (!url.startsWith(ORIGIN) && !url.startsWith("data:") && !url.startsWith("blob:")) external.push(url);
    });
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    await open(page, "/test-drive");
    await fillDrive(page);
    await page.getByRole("button", { name: "Request a test drive" }).click();
    await expect(page.getByRole("status").filter({ hasText: "This was a demonstration" })).toBeVisible();
    expect(external).toEqual([]);
    expect(posts.every((u) => u.startsWith(ORIGIN))).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });
});

test.describe("/contact", () => {
  test("empty submit shows the error summary; a valid message shows the demonstration panel", async ({ page }) => {
    await open(page, "/contact");
    await page.getByRole("button", { name: "Send request" }).click();
    const summary = alertOf(page);
    await expect(summary).toBeFocused();
    for (const label of ["Name", "Email", "Topic", "Message"]) await expect(summary.getByRole("link", { name: new RegExp(`^${label}:`) })).toBeVisible();

    await page.getByLabel(/^Name/).fill("Sam Example");
    await page.getByLabel(/^Email/).fill("sam@example.com");
    await page.getByLabel(/^Topic/).selectOption("press");
    await page.getByLabel(/^Model of interest/).selectOption("vire");
    await page.getByLabel(/^Message/).fill("Could you tell me more about the Vire lineup?");
    await page.getByLabel(/I understand this is a demonstration/).check();
    await page.getByRole("button", { name: "Send request" }).click();
    const panel = page.getByRole("status").filter({ hasText: "This was a demonstration" });
    await expect(panel).toContainText(DEMO);
    await expect(panel).toContainText("Press & media");
    await expect(panel).toContainText("ORVANE Vire");
  });

  test("a too-short message is rejected on the server with JavaScript off", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL: ORIGIN });
    const page = await context.newPage();
    await page.goto("/contact");
    await page.locator("#ct-name:visible").fill("Sam Example");
    await page.locator("#ct-email:visible").fill("sam@example.com");
    await page.locator("#ct-topic:visible").selectOption("other");
    await page.locator("#ct-message:visible").fill("Too short");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(alertOf(page)).toContainText("at least 20 characters");
    await context.close();
  });

  test("side column: links, FAQ disclosure, and no invented contact details", async ({ page }) => {
    await open(page, "/contact");
    const aside = page.getByRole("complementary", { name: "About this form" });
    for (const href of ["/models", "/configure", "/test-drive"]) await expect(aside.locator(`a[href="${href}"]`)).toBeVisible();
    const first = aside.locator("details").first();
    await expect(first).not.toHaveAttribute("open", "");
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await expect(first).toContainText("fictional");
    await expect(page.locator('#main a[href^="tel:"], #main a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator("#main")).not.toContainText(/\+?\d[\d ()-]{8,}\d/);
  });
});

test.describe("/gallery", () => {
  test("filters update the count, the grid and the pressed state", async ({ page }) => {
    await open(page, "/gallery");
    const count = page.getByTestId("gallery-count");
    const tiles = page.locator("[data-tile]");
    const total = await tiles.count();
    expect(total).toBeGreaterThanOrEqual(24);
    await expect(count).toHaveText(`Showing ${total} of ${total} images`);
    await expect(page.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: /^Interior/ }).click();
    await expect(page.getByRole("button", { name: /^Interior/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "false");
    const interior = await tiles.count();
    expect(interior).toBeGreaterThan(0);
    expect(interior).toBeLessThan(total);
    await expect(count).toHaveText(`Showing ${interior} of ${total} images`);

    await page.getByRole("button", { name: /^Sola/ }).click();
    const sola = await tiles.count();
    await expect(count).toHaveText(`Showing ${sola} of ${total} images`);
    await page.getByRole("button", { name: /^All/ }).click();
    await expect(tiles).toHaveCount(total);
  });

  test("every grid image has alt text and none is pending", async ({ page }) => {
    await open(page, "/gallery");
    const alts = await page.locator("#main img").evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).alt));
    expect(alts.length).toBeGreaterThan(24);
    for (const alt of alts) expect(alt.trim().length, alt).toBeGreaterThan(15);
    await expect(page.locator("[data-image-pending]")).toHaveCount(0);
  });

  test("the lightbox opens from the keyboard, moves with arrows, closes with Esc and returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/gallery");
    const tile = page.locator("[data-tile]").nth(2);
    await tile.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Image viewer" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    const caption = dialog.locator("#lightbox-caption");
    const first = await caption.innerText();
    await expect(dialog).toContainText("03 /");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("04 /");
    await expect(caption).not.toHaveText(first);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("02 /");
    // Focus stays inside the dialog while tabbing.
    for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("[data-tile]").nth(1)).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("the close button closes and returns focus to the tile that opened it", async ({ page }) => {
    await open(page, "/gallery");
    const tile = page.locator("[data-tile]").first();
    await tile.click();
    const dialog = page.getByRole("dialog", { name: "Image viewer" });
    await expect(dialog.getByRole("img")).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(tile).toBeFocused();
  });

  test("the film strip scrolls with its buttons", async ({ page }) => {
    await open(page, "/gallery");
    const strip = page.getByRole("region", { name: "From sketch to platform", exact: true });
    await strip.scrollIntoViewIfNeeded();
    const next = page.getByRole("button", { name: "Next image" });
    await next.click();
    await expect(page.getByText(/^02$/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous image" })).toBeEnabled();
  });
});

for (const path of ["/gallery", "/test-drive", "/contact"]) {
  for (const width of [300, 390, 1440]) {
    test(`${path} has no horizontal overflow at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, path);
      expect(await overflow(page)).toBe(0);
    });
  }
}

test("the gallery lightbox has no horizontal overflow at 300", async ({ page }) => {
  await page.setViewportSize({ width: 300, height: 700 });
  await open(page, "/gallery");
  await page.locator("[data-tile]").first().click();
  await expect(page.getByRole("dialog", { name: "Image viewer" })).toBeVisible();
  expect(await overflow(page)).toBe(0);
});
