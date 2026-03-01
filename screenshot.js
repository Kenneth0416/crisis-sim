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

  const screenshot = async (name, wait = 800) => {
    await page.waitForTimeout(wait);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${name}.png`),
      fullPage: false,
    });
    console.log(`✓ ${name}.png`);
  };

  console.log('\n📸 Capturing screenshots...\n');

  // ===== DESKTOP FLOW =====
  console.log('=== Desktop Flow ===');

  // 1. Login
  await page.goto(baseUrl);
  await screenshot('01-login');
  await page.fill('input#nickname', 'DemoUser');
  await screenshot('02-login-filled');
  await page.click('button:has-text("Start Simulation")');
  await page.waitForURL('**/consent', { timeout: 10000 });

  // 2. Consent
  await screenshot('03-consent');
  await page.check('input[type="checkbox"]');
  await screenshot('04-consent-checked');
  await page.click('button:has-text("Continue to Simulation")');
  await page.waitForURL('**/mini-game/1', { timeout: 10000 });

  // 3. Mini-game 1 - Priority Ranking
  await screenshot('05-mini-game-1');
  // Click 3 concerns for each of 4 stakeholders
  const concernButtons = await page.locator('.grid button').all();
  let clicked = 0;
  for (const btn of concernButtons) {
    const text = await btn.textContent();
    if (!text || text.includes('Confirm') || text.includes('✓')) continue;
    try {
      if (await btn.isEnabled()) {
        await btn.click();
        await page.waitForTimeout(100);
        clicked++;
        if (clicked >= 12) break;
      }
    } catch (e) {}
  }
  console.log(`  MG1: Clicked ${clicked} buttons`);
  await screenshot('06-mini-game-1-selecting');

  // Submit MG1
  await page.waitForSelector('button:has-text("Confirm Priorities"):not([disabled])', { timeout: 10000 });
  await page.click('button:has-text("Confirm Priorities")');
  await page.waitForTimeout(3000);
  console.log(`  URL after MG1: ${page.url()}`);

  // 4. Mini-game 2 - Tension Identification (fallback to direct nav)
  if (!page.url().includes('/mini-game/2')) {
    await page.goto(`${baseUrl}/mini-game/2`);
  }
  await screenshot('07-mini-game-2');

  // Click 2 stakeholders for each of 5 statements
  await page.waitForTimeout(1000);
  const statements = await page.locator('[class*="border-slate-100"]').all();
  for (let i = 0; i < Math.min(5, statements.length); i++) {
    const stmtCards = await statements[i].locator('[role="button"]').all();
    for (let j = 0; j < Math.min(2, stmtCards.length); j++) {
      try { await stmtCards[j].click(); await page.waitForTimeout(100); } catch (e) {}
    }
  }
  console.log('  MG2: Selected 2 per statement');
  await screenshot('08-mini-game-2-selecting');

  // Submit MG2
  await page.waitForTimeout(1000);
  const mg2Confirm = await page.locator('button:has-text("Confirm Selection")').first();
  if (await mg2Confirm.isEnabled().catch(() => false)) {
    await mg2Confirm.click();
    await page.waitForTimeout(3000);
  }
  console.log(`  URL after MG2: ${page.url()}`);

  // 5. Mini-game 3 - Info Source Ranking (fallback to direct nav)
  if (!page.url().includes('/mini-game/3')) {
    await page.goto(`${baseUrl}/mini-game/3`);
    await page.waitForTimeout(2000);
  }
  await screenshot('09-mini-game-3');

  // Use select dropdowns for MG3 (5 sources)
  await page.waitForTimeout(1000);
  const selects = await page.locator('select').all();
  console.log(`  Found ${selects.length} select dropdowns`);
  for (let i = 0; i < Math.min(5, selects.length); i++) {
    try {
      await selects[i].selectOption({ value: String(i + 1) });
      await page.waitForTimeout(100);
    } catch (e) {}
  }
  console.log('  MG3: Assigned ranks via selects');
  await screenshot('10-mini-game-3-selecting');

  // Submit MG3
  await page.waitForTimeout(1000);
  const mg3Confirm = await page.locator('button:has-text("Confirm")').first();
  if (await mg3Confirm.isEnabled().catch(() => false)) {
    await mg3Confirm.click();
    await page.waitForTimeout(3000);
  }
  console.log(`  URL after MG3: ${page.url()}`);

  // 6. Mini-game 4 - Response Dimension Ranking (fallback to direct nav)
  if (!page.url().includes('/mini-game/4')) {
    await page.goto(`${baseUrl}/mini-game/4`);
    await page.waitForTimeout(2000);
  }
  await screenshot('11-mini-game-4');

  // Use select dropdowns for MG4 (4 dimensions)
  await page.waitForTimeout(1000);
  const mg4Selects = await page.locator('select').all();
  console.log(`  Found ${mg4Selects.length} select dropdowns for MG4`);
  for (let i = 0; i < Math.min(4, mg4Selects.length); i++) {
    try {
      mg4Selects[i].selectOption({ value: String(i + 1) });
      await page.waitForTimeout(100);
    } catch (e) {}
  }
  console.log('  MG4: Assigned ranks via selects');
  await screenshot('12-mini-game-4-selecting');

  // Submit MG4
  await page.waitForTimeout(1000);
  const mg4Confirm = await page.locator('button:has-text("Confirm")').first();
  if (await mg4Confirm.isEnabled().catch(() => false)) {
    await mg4Confirm.click();
    await page.waitForTimeout(3000);
  }
  console.log(`  URL after MG4: ${page.url()}`);

  // 7. Briefing (fallback to direct nav)
  if (!page.url().includes('/briefing')) {
    await page.goto(`${baseUrl}/briefing`);
    await page.waitForTimeout(2000);
  }
  await screenshot('13-briefing');

  // 8. Scenario 1
  await page.goto(`${baseUrl}/scenario/1`);
  await page.waitForTimeout(2000);
  await screenshot('14-scenario-1');

  // Check if scenario has decision options
  const hasDecision = await page.locator('input[name="decision"]').count().catch(() => 0);
  console.log(`  Scenario decision options: ${hasDecision}`);

  if (hasDecision > 0) {
    // Select option and submit for each scenario
    // Click on the label card instead of the radio input
    const s1Options = await page.locator('label.group.relative').all();
    if (s1Options.length > 1) {
      await s1Options[1].click();
      await page.waitForTimeout(500);
      await screenshot('15-scenario-1-selected');
      await page.click('button:has-text("Confirm Decision")');
      await page.waitForTimeout(2000);

      await screenshot('16-scenario-2');
      const s2Options = await page.locator('label.group.relative').all();
      if (s2Options.length > 0) {
        await s2Options[0].click();
        await page.waitForTimeout(500);
        await screenshot('17-scenario-2-selected');
        await page.click('button:has-text("Confirm Decision")');
        await page.waitForTimeout(2000);
      }

      await screenshot('18-scenario-3');
      const s3Options = await page.locator('label.group.relative').all();
      if (s3Options.length > 0) {
        await s3Options[0].click();
        await page.waitForTimeout(500);
        await screenshot('19-scenario-3-selected');
        await page.click('button:has-text("Confirm Decision")');
        await page.waitForTimeout(2000);
      }

      await screenshot('20-comparison');

      // Click continue to reflection
      const continueBtn = await page.locator('button:has-text("Continue")').first();
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
        await page.waitForTimeout(3000);
      }
    }
  }

  // 9. Reflection (direct nav)
  await page.goto(`${baseUrl}/reflection`);
  await page.waitForTimeout(2000);
  await screenshot('21-reflection');

  // Fill ratings - click on label cards instead of radio inputs
  const radioLabels = await page.locator('label.flex-1').all();
  console.log(`  Found ${radioLabels.length} rating options`);
  for (let i = 0; i < Math.min(6, radioLabels.length); i++) {
    try {
      await radioLabels[i].click();
      await page.waitForTimeout(100);
    } catch (e) {}
  }
  await screenshot('22-reflection-filled');

  // Fill textareas
  const textareas = await page.locator('textarea').all();
  for (let i = 0; i < Math.min(7, textareas.length); i++) {
    if (await textareas[i].isVisible().catch(() => false)) {
      await textareas[i].fill('Good experience');
      await page.waitForTimeout(100);
    }
  }
  await screenshot('23-reflection-complete');

  // Submit reflection
  const submitBtn = await page.locator('button[type="submit"]').first();
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }

  // 10. Finish
  await page.goto(`${baseUrl}/finish`);
  await page.waitForTimeout(2000);
  await screenshot('24-finish');

  // 11. Admin
  await page.goto(`${baseUrl}/admin`);
  await page.waitForTimeout(2500);
  await screenshot('25-admin');

  // ===== MOBILE VIEWS =====
  console.log('\n=== Mobile Views ===');
  await page.setViewportSize({ width: 390, height: 844 });

  // Need to re-login for mobile since session is lost
  await page.goto(baseUrl);
  await page.waitForTimeout(1000);
  await screenshot('26-mobile-login');

  await page.goto(`${baseUrl}/consent`);
  await page.waitForTimeout(1000);
  await screenshot('27-mobile-consent');

  await page.goto(`${baseUrl}/scenario/1`);
  await page.waitForTimeout(1000);
  await screenshot('28-mobile-scenario');

  // ===== TABLET LANDSCAPE =====
  console.log('\n=== Tablet Landscape ===');
  await page.setViewportSize({ width: 1024, height: 768 });

  await page.goto(`${baseUrl}/scenario/1`);
  await page.waitForTimeout(1000);
  await screenshot('29-tablet-scenario');

  await browser.close();
  console.log('\n✅ All screenshots captured!\n');
}

main().catch(e => { console.error(e); process.exit(1); });