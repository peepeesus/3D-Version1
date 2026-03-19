const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to live site...');
  await page.goto('https://3d-version1.vercel.app', { waitUntil: 'networkidle' });

  // Wait for it to load
  await page.waitForTimeout(5000);

  console.log('Forcing scroll to collections...');
  // Force scroll bypassing Lenis if possible
  await page.evaluate(() => {
    const el = document.getElementById('collections');
    if (el) el.scrollIntoView();
  });

  await page.waitForTimeout(2000);

  console.log('Taking Collections screenshot...');
  await page.screenshot({ path: 'artifacts/proof_screenshots/collections_forced_proof.png' });

  await browser.close();
  console.log('Done.');
})();
