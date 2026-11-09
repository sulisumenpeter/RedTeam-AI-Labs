import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Ensure screenshots dir exists
  const outDir = path.resolve('docs/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Desktop Hero
  console.log('Capturing desktop hero...');
  await page.screenshot({ path: path.join(outDir, 'redesign_desktop_hero.png'), clip: { x: 0, y: 0, width: 1440, height: 950 } });

  // 2. Desktop Full Page
  console.log('Capturing desktop full page...');
  await page.screenshot({ path: path.join(outDir, 'redesign_desktop_full.png'), fullPage: true });

  // 3. Mobile Viewport
  console.log('Capturing mobile viewports...');
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await mobilePage.screenshot({ path: path.join(outDir, 'redesign_mobile_hero.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });
  await mobilePage.screenshot({ path: path.join(outDir, 'redesign_mobile_full.png'), fullPage: true });

  await mobileContext.close();
  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});

