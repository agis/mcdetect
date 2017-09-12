const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('pageerror', (...args) => console.log('PAGE LOG:', ...args));
  page.on('error', (...args) => console.log('PAGE LOG:', ...args));
  page.on('console', (...args) => console.log('PAGE LOG:', ...args));
  page.on('requestfailed', (...args) => console.log('REQUEST FAILED:', ...args));

  await page.goto('https://googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/xmlhttprequest-example.html');

  browser.close();
})();
