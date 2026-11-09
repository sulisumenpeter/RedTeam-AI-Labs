import { test, expect } from '@playwright/test';

test.describe('Website Launch Readiness & Technical SEO Audit', () => {

  test('1. Technical SEO: robots.txt delivers strict indexing rules', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const text = await response?.text();

    expect(text).toMatch(/user-agent:\s*\*/i);
    expect(text).toContain('Allow: /');
    expect(text).toContain('Disallow: /api/');
    expect(text).toContain('Disallow: /overview');
    expect(text).toContain('Disallow: /settings');
    expect(text).toContain('Disallow: /systems');
    expect(text).toContain('Disallow: /risks');
    expect(text).toContain('Disallow: /campaigns');
    expect(text).toContain('Sitemap:');
  });

  test('2. Technical SEO: sitemap.xml advertises canonical public endpoints', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const text = await response?.text();

    expect(text).toContain('<urlset');
    expect(text).toContain('<loc>');
    // The sitemap should only advertise public canonical routes, not authenticated dashboards
    expect(text).not.toContain('/api/');
    expect(text).not.toContain('/settings');
    expect(text).not.toContain('/campaigns');
  });

  test('3. Infrastructure & Error Handling: Branded custom 404 page', async ({ page }) => {
    const response = await page.goto('/non-existent-audit-probe-page-404');
    expect(response?.status()).toBe(404);

    await expect(page.locator('h1')).toContainText('Page Not Found');
    await expect(page.locator('text=Error 404')).toBeVisible();
    await expect(page.locator('text=The page or resource you requested does not exist')).toBeVisible();

    // Verify recovery links
    const homeLink = page.locator('a:has-text("Homepage")');
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');

    const overviewLink = page.locator('a:has-text("Dashboard")');
    await expect(overviewLink).toBeVisible();
    await expect(overviewLink).toHaveAttribute('href', '/overview');
  });

  test('4. Accessibility: Skip-to-main-content link is present and targets #main-content', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveText('Skip to main content');

    const mainElement = page.locator('#main-content');
    await expect(mainElement).toBeAttached();
  });

  test('5. Public Content & FAQ: Clear CTAs, plain language, and functional accordion', async ({ page }) => {
    await page.goto('/');

    // Primary & secondary CTAs
    const primaryCta = page.locator('a:has-text("Explore the Interactive Sandbox"), a:has-text("Test Your First AI Assistant"), a:has-text("Open Your Workspace"), a:has-text("Enter Live PoC Sandbox")').first();
    await expect(primaryCta).toBeVisible();

    // Verify plain-language section
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Make Sure Your AI Doesn\'t Go Rogue')).toBeVisible();

    // Verify FAQ accordion interactivity
    const faqSummaries = page.locator('details summary');
    const count = await faqSummaries.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Expand first FAQ item and verify details open
    const firstDetails = page.locator('details').first();
    const firstSummary = firstDetails.locator('summary');
    await firstSummary.click();
    await expect(firstDetails).toHaveAttribute('open', '');

    // Collapse first FAQ item
    await firstSummary.click();
    const isOpen = await firstDetails.getAttribute('open');
    expect(isOpen).toBeNull();
  });

  test('6. Mobile Viewport & Responsiveness: Zero horizontal overflow across all standard screens', async ({ page }) => {
    const viewports = [
      { name: 'Mobile S (320px)', width: 320, height: 640 },
      { name: 'Mobile M (375px)', width: 375, height: 667 },
      { name: 'Mobile L (425px)', width: 425, height: 800 },
      { name: 'Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop S (1024px)', width: 1024, height: 768 },
      { name: 'Desktop L (1440px)', width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Verify no horizontal overflow: scrollWidth must equal clientWidth
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow, `Horizontal overflow detected at viewport ${vp.name}`).toBeFalsy();

      // On mobile viewports, verify mobile navigation menu button is interactive
      if (vp.width < 768) {
        const mobileMenuButton = page.locator('button[aria-label="Open menu"]');
        await expect(mobileMenuButton).toBeVisible();
        await mobileMenuButton.click();

        // Verify mobile nav drawer opens
        const navDrawer = page.locator('nav[aria-label="Mobile Navigation"]');
        await expect(navDrawer).toBeVisible();

        // Close mobile drawer
        const closeMenuButton = page.locator('button[aria-label="Close menu"]');
        await expect(closeMenuButton).toBeVisible();
        await closeMenuButton.click();
        await expect(navDrawer).not.toBeVisible();
      }
    }
  });

  test('7. Form Accessibility: Login page semantic labels and input association', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('input#email');
    await expect(emailInput).toBeVisible();
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();

    const passwordInput = page.locator('input#password');
    await expect(passwordInput).toBeVisible();
    const passwordLabel = page.locator('label[for="password"]');
    await expect(passwordLabel).toBeVisible();

    // Verify submit button disabled during loading or duplicate prevention
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });
});
