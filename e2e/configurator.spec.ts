import { expect, test, type Page } from "@playwright/test";

const KEY = "orvane.configurator.v1";
const stageImg = (page: Page) => page.locator("[data-stage] img:not([alt=''])");
const money = (text: string | null) => Number((text ?? "").replace(/[^\d]/g, ""));

/** Press Tab until the focused element matches, like a keyboard user would. */
async function tabTo(page: Page, name: RegExp) {
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? `${el.tagName}:${el.textContent?.trim() ?? ""}` : "";
    });
    if (name.test(label)) return;
  }
  throw new Error(`Could not reach ${name} by keyboard`);
}

const heading = (page: Page) => page.locator("#step-heading");

test.describe("configurator flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/configure");
    await expect(heading(page)).toHaveText(/choose your model/i);
  });

  test("completes a full configuration by keyboard only", async ({ page }) => {
    await heading(page).focus();
    await page.keyboard.press("Tab"); // checked model radio (Aren)
    await page.keyboard.press("ArrowDown"); // Sola
    await expect(page.getByRole("radio", { name: /Sola From/ })).toBeChecked();
    await tabTo(page, /^BUTTON:Next/);
    await page.keyboard.press("Enter");

    await expect(heading(page)).toHaveText(/variant/i);
    await expect(heading(page)).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown"); // Sola Terrain
    await expect(page.getByRole("radio", { name: /Sola Terrain/ })).toBeChecked();
    await tabTo(page, /^BUTTON:Next/);
    await page.keyboard.press("Enter");

    await expect(heading(page)).toHaveText(/colour/i);
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown"); // Basalt Black
    await expect(page.getByRole("radio", { name: /Basalt Black/ })).toBeChecked();
    await tabTo(page, /^BUTTON:Next/);
    await page.keyboard.press("Enter");

    await expect(heading(page)).toHaveText(/wheels/i);
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown"); // Blade
    await tabTo(page, /^BUTTON:Next/);
    await page.keyboard.press("Enter");

    await expect(heading(page)).toHaveText(/interior/i);
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown"); // Dune
    await expect(page.getByRole("radio", { name: /^Dune/ })).toBeChecked();
    await tabTo(page, /^BUTTON:Next/);
    await page.keyboard.press("Enter");

    await expect(heading(page)).toHaveText(/packages/i);
    await page.keyboard.press("Tab"); // Assist Plus checkbox
    await page.keyboard.press("Space");
    await expect(page.getByRole("checkbox", { name: /Assist Plus/ })).toBeChecked();
    await tabTo(page, /^BUTTON:View summary/);
    await page.keyboard.press("Enter");

    await expect(heading(page)).toHaveText(/your sola/i);
    const summary = page.locator("#config-summary");
    await expect(summary).toContainText("Sola Terrain");
    await expect(summary).toContainText("Basalt Black");
    await expect(summary).toContainText("Blade");
    await expect(summary).toContainText("Dune");
    await expect(summary).toContainText("Assist Plus");
    await expect(summary).toContainText("Winter package (included with Sola Terrain)");
    await expect(page.locator('a[href="/test-drive?model=sola"]').first()).toBeVisible();
  });

  test("colour change swaps the stage image and updates the live region", async ({ page }) => {
    await page.goto("/configure?model=aren&step=colour");
    await expect(stageImg(page)).toHaveAttribute("src", /aren-ext-lunar-silver/);
    await page.getByRole("radio", { name: /^Tide Blue/ }).check({ force: true });
    await expect(stageImg(page)).toHaveAttribute("src", /aren-ext-tide-blue/);
    await expect(page.getByTestId("stage-live")).toHaveText("Exterior: Tide Blue");
  });

  test("angle views exist only in Lunar Silver", async ({ page }) => {
    await page.goto("/configure?model=aren&step=colour");
    await page.getByRole("radio", { name: "Rear 3/4" }).check({ force: true });
    await expect(stageImg(page)).toHaveAttribute("src", /aren-view-rear/);
    await page.getByRole("radio", { name: /^Ember/ }).check({ force: true });
    await expect(stageImg(page)).toHaveAttribute("src", /aren-ext-ember/);
    await expect(page.getByRole("radio", { name: "Rear 3/4" })).toBeDisabled();
    await expect(page.getByText("Additional views shown in Lunar Silver.")).toBeVisible();
  });

  test("wheel step shows the wheel view and the honest preview note", async ({ page }) => {
    await page.goto("/configure?model=vire&step=wheels");
    await expect(page.getByText("Vehicle preview shown with Blade 21 wheels", { exact: false }).first()).toBeVisible();
    await expect(stageImg(page)).toHaveAttribute("src", /wheel-aero/);
    await page.getByRole("radio", { name: /^Forge/ }).check({ force: true });
    await expect(stageImg(page)).toHaveAttribute("src", /wheel-forge/);
    await expect(page.getByTestId("stage-live")).toHaveText("Wheels: Forge, 22 inch");
  });

  test("interior step switches the stage to the cabin", async ({ page }) => {
    await page.goto("/configure?model=aren&step=interior");
    await expect(stageImg(page)).toHaveAttribute("src", /aren-int-onyx/);
    await page.getByRole("radio", { name: /^Ember/ }).check({ force: true });
    await expect(stageImg(page)).toHaveAttribute("src", /aren-int-ember/);
  });

  test("price total matches the itemised sum", async ({ page }) => {
    await page.goto("/configure?model=aren&step=trim");
    await page.getByRole("radio", { name: /Aren Performance/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("radio", { name: /^Ember/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("radio", { name: /^Forge/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("radio", { name: /^Dune/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("checkbox", { name: /^Acoustic Comfort/ }).check({ force: true });
    await page.getByRole("checkbox", { name: /^Rear Lounge/ }).check({ force: true });
    await page.getByRole("button", { name: "View summary" }).click();

    const amounts = await page.locator("#config-summary tbody td").allTextContents();
    const sum = amounts.map(money).reduce((a, b) => a + b, 0);
    expect(sum).toBeGreaterThan(118000);
    expect(money(await page.getByTestId("summary-total").textContent())).toBe(sum);
    expect(money(await page.getByTestId("concept-price").first().textContent())).toBe(sum);
  });

  test("package rules: requirement and conflict are explained and enforced", async ({ page }) => {
    await page.goto("/configure?model=aren&step=packages");
    await expect(page.getByRole("checkbox", { name: /Rear Lounge/ })).toBeDisabled();
    await expect(page.getByText("Requires Acoustic Comfort")).toBeVisible();
    await page.goto("/configure?model=vire&step=packages");
    await page.getByRole("checkbox", { name: /Track/ }).check({ force: true });
    await expect(page.getByRole("checkbox", { name: /Grand Tour/ })).toBeDisabled();
    await expect(page.getByText("Not available with Track")).toBeVisible();
  });

  test("deep link ?model=sola loads Sola", async ({ page }) => {
    await page.goto("/configure?model=sola");
    await expect(page.getByRole("radio", { name: /Sola From/ })).toBeChecked();
    await expect(page.getByTestId("concept-price").first()).toContainText("132,000");
    await page.goto("/configure?model=nonsense&step=nope");
    await expect(page.getByRole("radio", { name: /Aren From/ })).toBeChecked();
  });

  test("changing model after edits asks for confirmation", async ({ page }) => {
    await page.goto("/configure?model=aren&step=colour");
    await page.getByRole("radio", { name: /^Ember/ }).check({ force: true });
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("radio", { name: /Vire From/ }).click({ force: true });
    await expect(page.getByRole("group", { name: "Confirm model change" })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Aren From/ })).toBeChecked();
    await page.getByRole("button", { name: "Keep Aren" }).click();
    await expect(page.getByRole("group", { name: "Confirm model change" })).toHaveCount(0);
    await page.getByRole("radio", { name: /Vire From/ }).click({ force: true });
    await page.getByRole("button", { name: "Switch to Vire" }).click();
    await expect(page.getByRole("radio", { name: /Vire From/ })).toBeChecked();
    await expect(page.getByTestId("concept-price").first()).toContainText("149,000");
  });

  test("save, reload, resume restores everything; delete removes it", async ({ page }) => {
    await page.goto("/configure?model=vire&step=colour");
    await page.getByRole("radio", { name: /^Ember/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("radio", { name: /^Forge/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("radio", { name: /^Dune/ }).check({ force: true });
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("checkbox", { name: /Carbon Aero/ }).check({ force: true });
    await page.getByRole("button", { name: "View summary" }).click();
    const total = await page.getByTestId("summary-total").textContent();

    await page.getByRole("button", { name: "Save configuration" }).click();
    await expect(page.getByText(/Saved on this device, /)).toBeVisible();
    const stored = await page.evaluate((k) => localStorage.getItem(k), KEY);
    expect(JSON.parse(stored!)).toMatchObject({ version: 1, config: { model: "vire", colour: "ember", wheels: "forge", interior: "dune" } });

    await page.goto("/configure");
    await expect(page.getByRole("region", { name: "Saved configuration" })).toContainText(/saved Vire configuration/);
    await page.getByRole("button", { name: "Resume saved configuration" }).click();
    await expect(heading(page)).toHaveText(/your vire/i);
    await expect(page.getByTestId("summary-total")).toHaveText(total!);
    await expect(page.locator("#config-summary")).toContainText("Ember");
    await expect(page.locator("#config-summary")).toContainText("Forge");
    await expect(page.locator("#config-summary")).toContainText("Carbon Aero");

    await page.getByRole("button", { name: "Delete saved configuration" }).click();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
    await page.goto("/configure");
    await expect(page.getByRole("region", { name: "Saved configuration" })).toHaveCount(0);
  });

  test("a deep link is not silently replaced by a saved build", async ({ page }) => {
    await page.addInitScript(
      (k) =>
        localStorage.setItem(
          k,
          JSON.stringify({ version: 1, savedAt: new Date().toISOString(), config: { version: 1, model: "aren", trim: "aren-touring", colour: "ember", wheels: "aero", interior: "onyx", packages: [] } }),
        ),
      KEY,
    );
    await page.goto("/configure?model=sola");
    await expect(page.getByRole("radio", { name: /Sola From/ })).toBeChecked();
    await expect(page.getByRole("region", { name: "Saved configuration" })).toContainText(/Loading a new Sola from your link/);
    await page.getByRole("button", { name: "Start new" }).click();
    await expect(page.getByRole("radio", { name: /Sola From/ })).toBeChecked();
  });

  test("restart returns to the model step after confirmation", async ({ page }) => {
    await page.goto("/configure?model=aren&step=summary");
    await page.getByRole("button", { name: "Restart" }).click();
    await expect(page.getByRole("group", { name: "Confirm restart" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(heading(page)).toHaveText(/your aren/i);
    await page.getByRole("button", { name: "Restart" }).click();
    await page.getByRole("button", { name: "Yes, restart" }).click();
    await expect(heading(page)).toHaveText(/choose your model/i);
  });

  test("summary Edit jumps back to the step", async ({ page }) => {
    await page.goto("/configure?model=aren&step=summary");
    await page.getByRole("button", { name: "Edit paint" }).click();
    await expect(heading(page)).toHaveText(/exterior colour/i);
    await expect(page.getByRole("button", { name: "Colour" }).first()).toHaveAttribute("aria-current", "step");
  });

  test("copy summary reports success or shows a manual fallback", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/configure?model=aren&step=summary");
    await page.getByRole("button", { name: "Copy summary as text" }).click();
    await expect(page.getByRole("status").filter({ hasText: /copied/i })).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain("ORVANE Aren");
    expect(text).toContain("Total concept price");
  });

  test("print view shows only the summary", async ({ page }) => {
    await page.goto("/configure?model=aren&step=summary");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("#config-summary")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save configuration" })).toBeHidden();
    await expect(page.getByRole("banner")).toBeHidden();
  });
});

test.describe("saved data handling", () => {
  test("corrupt localStorage does not break the page and is discarded", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript((k) => localStorage.setItem(k, "{not json"), KEY);
    await page.goto("/configure");
    await expect(heading(page)).toHaveText(/choose your model/i);
    await expect(page.getByRole("region", { name: "Saved configuration" })).toHaveCount(0);
    await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
    expect(errors).toEqual([]);
  });

  test("outdated saved data is repaired and the visitor is told", async ({ page }) => {
    await page.addInitScript(
      (k) => localStorage.setItem(k, JSON.stringify({ version: 0, config: { model: "sola", colour: "gone", packages: ["x"] } })),
      KEY,
    );
    await page.goto("/configure");
    const banner = page.getByRole("region", { name: "Saved configuration" });
    await expect(banner).toContainText(/reset to defaults/);
    await page.getByRole("button", { name: "Resume saved configuration" }).click();
    await expect(page.getByTestId("summary-total")).toContainText("132,000");
  });
});

test.describe("layout", () => {
  for (const width of [300, 390, 768, 1440]) {
    test(`no horizontal overflow at ${width}px on every step`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 1440 ? 900 : 800 });
      for (const step of ["model", "trim", "colour", "wheels", "interior", "packages", "summary"]) {
        await page.goto(`/configure?model=sola&step=${step}`);
        await expect(heading(page)).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${step} at ${width}`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("fixed price bar is present and marked data-fixed on phones, absent on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/configure");
    const bar = page.locator("[data-config-bar]");
    await expect(bar).toBeVisible();
    await expect(bar).toHaveAttribute("data-fixed");
    expect(await bar.evaluate((el) => getComputedStyle(el).position)).toBe("fixed");
    await expect(bar.getByRole("button", { name: "Next" })).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(bar).toBeHidden();
  });

  test("below 250px the layout locks at 500px", async ({ page }) => {
    await page.setViewportSize({ width: 240, height: 800 });
    await page.goto("/configure");
    expect(await page.locator("#root").evaluate((el) => el.getBoundingClientRect().width)).toBe(500);
    expect(await page.locator("[data-config-bar]").evaluate((el) => el.getBoundingClientRect().width)).toBe(500);
  });

  test("desktop: stage left, rail right, price and Next visible without scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/configure");
    const stage = await page.locator("[data-stage]").boundingBox();
    const next = await page.getByRole("button", { name: "Next" }).boundingBox();
    expect(stage!.x).toBe(0);
    expect(next!.x).toBeGreaterThan(stage!.width);
    expect(next!.y + next!.height).toBeLessThanOrEqual(900);
    await expect(page.getByTestId("concept-price").first()).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("changes are instant and still work", async ({ page }) => {
    await page.goto("/configure?model=aren&step=colour");
    await page.getByRole("radio", { name: /^Tide Blue/ }).check({ force: true });
    await expect(stageImg(page)).toHaveAttribute("src", /aren-ext-tide-blue/);
    const seconds = await stageImg(page).evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    expect(seconds).toBeLessThan(0.05);
    await expect(page.getByTestId("stage-live")).toHaveText("Exterior: Tide Blue");
  });
});
