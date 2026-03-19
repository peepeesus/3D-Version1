const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to collections anchor...');
  await page.goto('https://3d-version1.vercel.app/#collections', { waitUntil: 'networkidle' });

  // Give it time to scroll there
  await page.waitForTimeout(5000);

  console.log('Taking Collections screenshot...');
  await page.screenshot({ path: 'artifacts/proof_screenshots/collections_direct_proof.png' });

  await browser.close();
  console.log('Done.');
})();
