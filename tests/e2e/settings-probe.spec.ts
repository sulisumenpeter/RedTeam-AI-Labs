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

test.describe('Target Connection Probe & Credential Handling', () => {
  test('Diagnoses 401 Unauthorized, missing keys, and prevents SSRF with zero retries', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Authenticate and open settings page
    await ensureAuthenticated(page);
    const settingsLoadedPromise = page.waitForResponse(
      (res) => res.url().includes('/api/settings') && res.request().method() === 'GET'
    );
    await page.goto('http://localhost:3000/settings');
    await settingsLoadedPromise;
    await expect(page.locator('h1')).toContainText('Platform & Security Settings');

    const endpointInput = page.locator('input[type="url"]');
    const apiKeyInput = page.locator('input[type="password"]');
    const testButton = page.locator('button:has-text("Test Connection")');

    // 2. Test intentionally invalid API key against OpenAI
    await endpointInput.fill('https://api.openai.com/v1/chat/completions');
    await apiKeyInput.fill('sk-invalid-test-credential-probe-99999');
    await testButton.click();

    // Verify immediate 401 authentication failure message without retry loop
    const errorBox = page.locator('.text-red-800');
    await expect(errorBox).toBeVisible({ timeout: 15000 });
    const invalidKeyText = await errorBox.textContent();
    expect(invalidKeyText).toContain('Authentication failed (HTTP 401 Unauthorized)');
    expect(invalidKeyText).not.toContain('attempts');
    expect(invalidKeyText).not.toContain('after 2 attempts');
    // Ensure the raw secret key was not reflected in the error text
    expect(invalidKeyText).not.toContain('sk-invalid-test-credential-probe-99999');

    // 3. Test missing API key against OpenAI
    await apiKeyInput.fill('');
    await testButton.click();

    await expect(errorBox).toBeVisible({ timeout: 15000 });
    const noKeyText = await errorBox.textContent();
    expect(noKeyText).toContain('Authentication required (HTTP 401 Unauthorized): No API key provided');
    expect(noKeyText).not.toContain('after 2 attempts');

    // 4. Test SSRF protection with loopback IP
    await endpointInput.fill('http://127.0.0.1:8000/v1');
    await testButton.click();

    await expect(errorBox).toBeVisible({ timeout: 5000 });
    const ssrfText = await errorBox.textContent();
    expect(ssrfText).toContain('External target endpoint blocked by security policy');

    // 5. Save target configuration and verify persistence across reload
    await endpointInput.fill('https://api.openai.com/v1/chat/completions');
    await page.click('button:has-text("Save Target Configuration")');
    await expect(page.locator('.text-emerald-800')).toContainText('persisted successfully', { timeout: 15000 });

    // Reload page to verify persistence
    await page.reload();
    const loadedInput = page.locator('input[type="url"]');
    await expect(loadedInput).toHaveValue('https://api.openai.com/v1/chat/completions', { timeout: 15000 });
  });
});

