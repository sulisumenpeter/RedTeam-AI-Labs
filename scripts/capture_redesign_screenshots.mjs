import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High-DPI crisp screenshots
  });
  const page = await context.newPage();

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const outDir = path.resolve('docs/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Capturing screenshots from ${baseUrl}...`);

  // 1. Landing Page
  console.log('Capturing Landing Page (/)...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01_landing_hero.png'), fullPage: false });
  await page.screenshot({ path: path.join(outDir, '01_landing_full.png'), fullPage: true });

  // 2. Login Page
  console.log('Capturing Login Page (/login)...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '02_login_page.png') });

  // Authenticate
  console.log('Authenticating for dashboard screens...');
  const signinRes = await page.request.post(`${baseUrl}/api/auth/login`, {
    data: {
      email: 'e2e-tester@redteam.internal',
      password: 'Password123!',
      action: 'signin',
    },
  });

  if (!signinRes.ok()) {
    console.log('Signin failed, trying signup...');
    await page.request.post(`${baseUrl}/api/auth/login`, {
      data: {
        email: 'e2e-tester@redteam.internal',
        password: 'Password123!',
        action: 'signup',
      },
    });
    await page.request.post(`${baseUrl}/api/auth/login`, {
      data: {
        email: 'e2e-tester@redteam.internal',
        password: 'Password123!',
        action: 'signin',
      },
    });
  }

  // 3. Overview Dashboard
  console.log('Capturing Overview Dashboard (/overview)...');
  await page.goto(`${baseUrl}/overview`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '03_overview_dashboard.png'), fullPage: true });

  // 4. AI Systems Inventory
  console.log('Capturing AI Systems Inventory (/systems)...');
  await page.goto(`${baseUrl}/systems`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '04_systems_inventory.png'), fullPage: true });

  // 5. Risk Management Matrix
  console.log('Capturing Risk Management (/risks)...');
  await page.goto(`${baseUrl}/risks`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '05_risks_management.png'), fullPage: true });

  // 6. Framework Library
  console.log('Capturing Framework Library (/frameworks)...');
  await page.goto(`${baseUrl}/frameworks`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '06_frameworks_library.png'), fullPage: true });

  // 7. Campaigns Page & Demo Campaign
  console.log('Capturing Campaigns (/campaigns)...');
  await page.goto(`${baseUrl}/campaigns`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '07_campaigns_list.png'), fullPage: true });

  console.log('Capturing Campaign Findings (/campaigns/demo)...');
  await page.goto(`${baseUrl}/campaigns/demo`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '08_campaign_findings.png'), fullPage: true });

  // 8. Governance Policy Builder
  console.log('Capturing Policy Builder (/policy)...');
  await page.goto(`${baseUrl}/policy`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '09_policy_builder.png'), fullPage: true });

  // 9. Platform Settings
  console.log('Capturing Settings (/settings)...');
  await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '10_settings_security.png'), fullPage: true });

  await browser.close();
  console.log('All screenshots captured successfully in docs/screenshots/!');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});

