const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'docs', 'screenshots');

async function main() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';

  const screenshot = async (name, wait = 1500) => {
    await page.waitForTimeout(wait);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${name}.png`),
      fullPage: false,
    });
    console.log(`✓ ${name}.png`);
  };

  console.log('\n📸 Capturing desktop views...\n');

  // 1. Login
  await page.goto(baseUrl);
  await screenshot('01-login');
  await page.fill('input#nickname', 'DemoUser');
  await screenshot('02-login-filled');
  await page.click('button:has-text("Start Simulation")');
  await page.waitForURL('**/consent');
  await screenshot('03-consent');

  // 4. Consent
  await page.check('input[type="checkbox"]');
  await screenshot('04-consent-checked');
  await page.click('button:has-text("Continue to Simulation")');
  await page.waitForURL('**/mini-game/1');
  await screenshot('05-mini-game-1');

  // Skip mini-game interaction - go straight to other pages for demo
  await page.goto(`${baseUrl}/mini-game/2`);
  await screenshot('06-mini-game-2');

  await page.goto(`${baseUrl}/mini-game/3`);
  await screenshot('07-mini-game-3');

  await page.goto(`${baseUrl}/mini-game/4`);
  await screenshot('08-mini-game-4');

  await page.goto(`${baseUrl}/briefing`);
  await screenshot('09-briefing');

  await page.goto(`${baseUrl}/scenario/1`);
  await page.waitForSelector('.group', { timeout: 10000 }).catch(() => {});
  await screenshot('10-scenario-1');

  await page.goto(`${baseUrl}/scenario/2`);
  await screenshot('11-scenario-2');

  await page.goto(`${baseUrl}/scenario/3`);
  await screenshot('12-scenario-3');

  await page.goto(`${baseUrl}/comparison`);
  await page.waitForTimeout(2500);
  await screenshot('13-comparison');

  await page.goto(`${baseUrl}/reflection`);
  await screenshot('14-reflection');

  await page.goto(`${baseUrl}/finish`);
  await screenshot('15-finish');

  await page.goto(`${baseUrl}/admin`);
  await page.waitForTimeout(2000);
  await screenshot('16-admin');

  // Mobile views
  console.log('\n📱 Capturing mobile views...\n');
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(baseUrl);
  await screenshot('17-mobile-login');

  await page.goto(`${baseUrl}/scenario/1`);
  await screenshot('18-mobile-scenario');

  await browser.close();

  console.log('\n✅ Done! Screenshots in docs/screenshots/');
}

main().catch(e => { console.error(e); process.exit(1); });