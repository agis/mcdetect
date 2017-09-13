const puppeteer = require('puppeteer');
const chalk = require('chalk');

const urls = [
  'https://googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/xmlhttprequest-example.html',
  'https://googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/passive-mixed-content.html',
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const failedReqs = {};

  page.on('requestfailed', r => {
    failedReqs[r._requestId] = r.url;
  });

  page._client.on('Network.loadingFailed', r => {
    if (r['blockedReason'] == 'mixed-content')
      console.log(chalk.red("\tBLOCKED: ") + failedReqs[r['requestId']]);
  });

  page._client.on('Network.requestWillBeSent', r => {
    if (r['request']['mixedContentType'] == 'optionally-blockable')
      console.log(chalk.yellow("\tWARNING: ") + r.request.url);
  });

  for (let url of urls) {
    console.log(chalk.green("CHECKING ") + url + " ...");
    await page.goto(url);
  }

  browser.close();
})();
