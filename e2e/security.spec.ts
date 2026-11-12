import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/models/sola", "/configure", "/gallery", "/contact", "/does-not-exist"];

test("security headers are set on every page", async ({ request }) => {
  for (const path of ROUTES) {
    const h = (await request.get(path)).headers();
    const csp = h["content-security-policy"] ?? "";
    expect(csp, path).toContain("default-src 'self'");
    expect(csp, path).toContain("frame-ancestors 'none'");
    expect(csp, path).toContain("object-src 'none'");
    expect(h["x-content-type-options"], path).toBe("nosniff");
    expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"], path).toMatch(/camera=\(\).*microphone=\(\).*geolocation=\(\)/);
    expect(h["x-frame-options"], path).toBe("DENY");
    expect(h["strict-transport-security"], path).toContain("max-age=");
  }
});

test("robots disallows crawling and pages are noindex", async ({ request, page }) => {
  expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("pages make no third-party requests and raise no CSP violations", async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? "http://localhost:3006").origin;
  const external: string[] = [];
  const problems: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (url.startsWith("data:") || url.startsWith("blob:")) return;
    if (new URL(url).origin !== origin) external.push(url);
  });
  page.on("console", (msg) => {
    if (/content security policy|refused to/i.test(msg.text())) problems.push(msg.text());
  });
  for (const path of ["/", "/models/aren", "/configure", "/technology", "/gallery", "/test-drive"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
  }
  expect(external).toEqual([]);
  expect(problems).toEqual([]);
});

test("route metadata: lengths, Open Graph and Twitter tags", async ({ page }) => {
  const paths = ["/", "/models", "/models/aren", "/configure", "/technology", "/innovation", "/performance", "/design", "/story", "/gallery", "/contact", "/test-drive"];
  for (const path of paths) {
    await page.goto(path);
    const title = await page.title();
    const desc = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(title.length, `${path} title "${title}"`).toBeLessThanOrEqual(65);
    expect(desc.length, `${path} description length`).toBeGreaterThanOrEqual(60);
    expect(desc.length, `${path} description length`).toBeLessThanOrEqual(165);
    await expect(page.locator('meta[property="og:title"]'), path).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]'), path).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]'), path).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]'), path).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="theme-color"]'), path).toHaveCount(1);
  }
});

test("reduced motion: no motion class and nothing stays hidden", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const path of ["/", "/models/aren", "/technology", "/innovation", "/performance", "/design", "/story"]) {
    await page.goto(path);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => document.documentElement.classList.contains("js-motion")), path).toBe(false);
    const hidden = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-reveal]")).filter((e) => {
          const s = getComputedStyle(e as HTMLElement);
          return s.opacity === "0" || s.visibility === "hidden";
        }).length,
    );
    expect(hidden, path).toBe(0);
  }
  await context.close();
});

test("without JavaScript the reveal content is visible", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/story");
  await expect(page.getByRole("heading", { name: /five chapters/i })).toBeVisible();
  await context.close();
});

test("if scripts never run the motion guard gives up and the content shows", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // Scripts from the server never load (no hydration, no GSAP); the inline guard still runs.
  await page.route("**/*.js*", (route) => (route.request().resourceType() === "script" ? route.abort() : route.continue()));
  await page.goto("/story");
  expect(await page.evaluate(() => document.documentElement.classList.contains("js-motion"))).toBe(true);
  await page.waitForTimeout(4600);
  expect(await page.evaluate(() => document.documentElement.classList.contains("motion-failed"))).toBe(true);
  await expect(page.getByRole("heading", { name: /five chapters/i })).toBeVisible();
  await context.close();
});
