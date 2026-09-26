import { test, expect } from '@playwright/test';

test.describe('RedTeam AI Golden Path (Real DB & Gemini)', () => {
  test('Complete safety audit workflow', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes for real Gemini generation & chunks
    
    // 1. Landing Page
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1')).toContainText('Test your AI');
    
    // 2. Navigate to Policy Builder
    await page.click('text=Run Safety Audit');
    await expect(page).toHaveURL(/.*\/policy/);
    await expect(page.locator('h1')).toContainText('Governance Policy Builder');

    // 3. Save Policy & Continue
    await page.click('text=Save Policy & Continue');
    
    // 4. Campaign Setup
    await expect(page).toHaveURL(/.*\/campaigns\/new/, { timeout: 10000 });
    await expect(page.locator('text=30 tests')).toBeVisible();

    // 5. Launch Campaign
    await page.click('text=Review & Execute 30 Tests');
    
    // 6. Dashboard processing
    await expect(page).toHaveURL(/.*\/campaigns\/.+/, { timeout: 30000 }); // Generation takes time
    await expect(page.locator('h1')).toContainText('RedTeam AI Lab');
    
    // Wait for the simulated execution to finish
    await expect(page.locator('text=SECURE').or(page.locator('text=VULNERABLE'))).toBeVisible({ timeout: 90000 });
    
    // Verify a finding was rendered
    await expect(page.locator('text=Showing')).toBeVisible();
  });
});

test.describe('Failure Modes', () => {
  test('Invalid DB configuration throws explicit UI error instead of silent success', async ({ page, context }) => {
    // Intercept the API call to mock a DB failure
    await page.route('/api/policies', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: "Failed to persist policy to database", details: "PGRST002 Could not query schema cache" })
      });
    });

    await page.goto('http://localhost:3000/policy');
    await page.click('text=Save Policy & Continue');
    
    // Ensure the app actually traps the error and displays it in the red banner
    const errorBanner = page.locator('.bg-red-50.text-red-700');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText('Failed to persist policy');
    await expect(errorBanner).toContainText('PGRST002');
  });
});
