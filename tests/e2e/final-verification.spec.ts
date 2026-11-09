import { test, expect } from '@playwright/test';

async function ensureAuthenticated(page: any) {
  let signinRes = await page.request.post('http://localhost:3000/api/auth/login', {
    data: {
      email: 'e2e-tester@redteam.internal',
      password: 'Password123!',
      action: 'signin',
    },
  });

  if (!signinRes.ok()) {
    await page.waitForTimeout(2500);
    signinRes = await page.request.post('http://localhost:3000/api/auth/login', {
      data: {
        email: 'e2e-tester@redteam.internal',
        password: 'Password123!',
        action: 'signin',
      },
    });
    if (!signinRes.ok()) {
      await page.waitForTimeout(3000);
      signinRes = await page.request.post('http://localhost:3000/api/auth/login', {
        data: {
          email: 'e2e-tester@redteam.internal',
          password: 'Password123!',
          action: 'signin',
        },
      });
    }
    expect(signinRes.ok()).toBeTruthy();
  }
}

test.describe('Final Independent Production-Readiness E2E Verification', () => {

  test('1. Homepage CTAs, Links, and Navigation Verification', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Verify all anchor links on the homepage have valid destinations
    const links = await page.locator('a[href]').all();
    expect(links.length).toBeGreaterThanOrEqual(10);

    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
      expect(href).not.toBe('javascript:void(0)');
    }

    // Verify Primary CTA in Hero links to /login or /overview
    const heroCta = page.locator('section a:has-text("Explore the Interactive Sandbox"), section a:has-text("Test Your First AI Assistant"), section a:has-text("Open Your Workspace")').first();
    await expect(heroCta).toBeVisible();
    const heroHref = await heroCta.getAttribute('href');
    expect(['/login', '/overview']).toContain(heroHref);

    // Verify Secondary CTA links to #how-it-works
    const secondaryCta = page.locator('section a:has-text("Inspect the Architecture"), section a:has-text("See How It Works")').first();
    await expect(secondaryCta).toBeVisible();
    await expect(secondaryCta).toHaveAttribute('href', '#how-it-works');

    // Click secondary CTA and ensure #how-it-works is in viewport
    await secondaryCta.click();
    await expect(page.locator('#how-it-works')).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });

  test('2. Form Submission & Error Handling (Login Form)', async ({ page }) => {
    await page.goto('/login');

    // Test submission with invalid credentials
    await page.fill('input#email', 'invalid-user@company.com');
    await page.fill('input#password', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Verify error banner is displayed with accessible role="alert"
    const errorAlert = page.locator('#login-error');
    await expect(errorAlert).toBeVisible({ timeout: 15000 });
    await expect(errorAlert).toHaveAttribute('role', 'alert');
    await expect(errorAlert).toContainText(/invalid|failed|unauthorized|rate limit/i);

    // Small delay to prevent Supabase Auth 429
    await page.waitForTimeout(1000);

    // Test submission with valid credentials
    await page.fill('input#email', 'e2e-tester@redteam.internal');
    await page.fill('input#password', 'Password123!');
    await page.click('button[type="submit"]');

    // Verify redirection to /overview
    await page.waitForURL('**/overview', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(/Governance|Overview/i);
  });

  test('3. Authenticated Dashboard User Journey & Console Health', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (req) => {
      if (req.failure()?.errorText !== 'net::ERR_ABORTED') {
        failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
      }
    });

    // Authenticate
    await ensureAuthenticated(page);

    const pagesToAudit = [
      { href: '/overview', expectedHeading: /Overview|Governance/i },
      { href: '/systems', expectedHeading: /AI System Inventory/i },
      { href: '/risks', expectedHeading: /AI Risk Management/i },
      { href: '/frameworks', expectedHeading: /Framework Library/i },
      { href: '/campaigns', expectedHeading: /AI Assurance Campaigns/i },
      { href: '/settings', expectedHeading: /Platform & Security Settings/i },
      { href: '/reports', expectedHeading: /Audit & Assurance Reports|Reports/i },
    ];

    // Initial navigation to dashboard
    await page.goto('/overview');
    await expect(page.locator('h1')).toContainText(/Overview|Governance/i);

    // Navigate to each section using real sidebar links (Single Page App user journey)
    for (const p of pagesToAudit) {
      if (p.href !== '/overview') {
        const navLink = page.locator(`aside a[href="${p.href}"]`);
        await navLink.click();
        // Strict URL matcher ensuring exact path equality and rejecting login redirects
        await page.waitForURL((url) => url.pathname === p.href, { timeout: 15000 });
        expect(page.url()).not.toContain('/login');
        await expect(page.locator('h1')).toContainText(p.expectedHeading);
      }
    }

    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });

  test('4. Mobile Navigation Drawer & Responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // 1. Unauthenticated landing mobile nav
    await page.goto('/');
    const openMenuBtn = page.locator('button[aria-label="Open menu"]');
    await expect(openMenuBtn).toBeVisible();
    await openMenuBtn.click();

    const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
    await expect(mobileNav).toBeVisible();

    const closeMenuBtn = page.locator('button[aria-label="Close menu"]');
    await expect(closeMenuBtn).toBeVisible();
    await closeMenuBtn.click();
    await expect(mobileNav).not.toBeVisible();

    // 2. Authenticated dashboard mobile drawer
    await ensureAuthenticated(page);

    await page.goto('/overview');
    const drawerToggleBtn = page.locator('button[aria-label="Open navigation menu"]');
    await expect(drawerToggleBtn).toBeVisible();
    await drawerToggleBtn.click();

    // Sidebar drawer should now be visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Backdrop should be visible
    const backdrop = page.locator('div[aria-hidden="true"]');
    await expect(backdrop.first()).toBeVisible();

    // Close button in sidebar
    const closeDrawerBtn = page.locator('button[aria-label="Close navigation menu"]');
    await expect(closeDrawerBtn).toBeVisible();
    await closeDrawerBtn.click();
  });

  test('5. Favicon and SVG Icon HTTP Availability', async ({ page }) => {
    const faviconRes = await page.goto('/favicon.ico');
    expect([200, 304]).toContain(faviconRes?.status());

    const iconRes = await page.goto('/icon.svg');
    expect([200, 304]).toContain(iconRes?.status());
    expect(iconRes?.headers()['content-type']).toContain('svg');
  });
});
