import { test, expect } from '@playwright/test';

async function ensureAuthenticated(page: any) {
  const signinRes = await page.request.post('http://localhost:3000/api/auth/login', {
    data: {
      email: 'e2e-tester@redteam.internal',
      password: 'Password123!',
      action: 'signin',
    },
  });

  if (!signinRes.ok()) {
    await page.request.post('http://localhost:3000/api/auth/login', {
      data: {
        email: 'e2e-tester@redteam.internal',
        password: 'Password123!',
        action: 'signup',
      },
    });

    const retrySignin = await page.request.post('http://localhost:3000/api/auth/login', {
      data: {
        email: 'e2e-tester@redteam.internal',
        password: 'Password123!',
        action: 'signin',
      },
    });
    expect(retrySignin.ok()).toBeTruthy();
  }
}

test.describe('RedTeam AI Golden Path (Real DB & Gemini)', () => {
  test('Complete safety audit workflow', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for real Gemini generation & chunks
    
    // Authenticate session so protected routes allow access
    await ensureAuthenticated(page);

    // 1. Landing Page
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1')).toContainText("Make Sure Your AI Doesn't Go Rogue Before Your Customers Use It");
    
    // 2. Navigate to Policy Builder
    await page.goto('http://localhost:3000/policy');
    await expect(page.locator('h1')).toContainText('Governance Policy Builder');

    // 3. Save Policy & Continue to Campaign
    await page.click('text=Save Policy & Continue to Campaign');
    
    // 4. Campaign Setup
    await expect(page).toHaveURL(/.*\/campaigns\/new/, { timeout: 30000 });
    // Ensure system and policy options are loaded into select dropdowns
    await expect(page.locator('select').first().locator('option')).not.toHaveCount(0, { timeout: 30000 });
    await expect(page.locator('select').nth(1).locator('option')).not.toHaveCount(0, { timeout: 30000 });

    // 5. Launch Campaign
    await page.click('text=Initialize & Review Execution Plan');
    
    // 6. Campaign Dashboard processing
    await expect(page).toHaveURL(/.*\/campaigns\/[a-f0-9\-]{36}/, { timeout: 90000 });
    await expect(page.locator('h1')).toContainText('Safety & Assurance Assessment');
    
    // 7. Execute Campaign Chunks
    await page.click('text=Start 30-Test Execution');

    // Wait for the chunk execution to process and reach completion
    await expect(page.locator('text=COMPLETED')).toBeVisible({ timeout: 150000 });
    
    // Verify report exporter / findings rendered
    await expect(page.locator('text=Export PDF Report')).toBeVisible();
    await expect(page.locator('text=Export JSON Audit Bundle')).toBeVisible();
  });
});

test.describe('Failure Modes', () => {
  test('Invalid DB configuration throws explicit UI error instead of silent success', async ({ page }) => {
    // Authenticate session so /policy route is loaded rather than redirected to /login
    await ensureAuthenticated(page);

    // Intercept the API call to mock a DB failure
    await page.route('**/api/policies', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: "Failed to persist policy to database", details: "PGRST002 Could not query schema cache" })
      });
    });

    await page.goto('http://localhost:3000/policy');
    await page.click('text=Save Policy & Continue to Campaign');
    
    // Ensure the app actually traps the error and displays it in the red banner
    const errorBanner = page.locator('.bg-red-50.text-red-700');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText('Failed to persist policy');
    await expect(errorBanner).toContainText('PGRST002');
  });
});
