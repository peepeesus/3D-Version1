const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to live site...');
  await page.goto('https://3d-version1.vercel.app', { waitUntil: 'networkidle' });

  // Wait for some time to let Spline/animations settle
  await page.waitForTimeout(5000);

  console.log('Taking Hero screenshot...');
  // Hero section is at the top
  await page.screenshot({ path: 'artifacts/proof_screenshots/hero_visible_proof.png' });

  console.log('Scrolling to Collections...');
  // Scroll down to the collection section (it's after the header/hero area)
  // We'll scroll by 1000 pixels or so
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  
  console.log('Taking Collections screenshot...');
  await page.screenshot({ path: 'artifacts/proof_screenshots/collections_funnel_proof.png' });

  console.log('Scrolling to Newsletter...');
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'artifacts/proof_screenshots/newsletter_proof.png' });

  await browser.close();
  console.log('Done.');
})();
