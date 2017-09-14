#!/usr/bin/env node

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { URL } = require('url');

const yargs = require('yargs')
  .usage('Usage: $0 [url ...] [options]')
  .config().alias('c', 'config')
  .option('e', {
    alias: 'errexit',
    describe: 'exit if a target URL cannot be fetched',
    boolean: true })
  .help().alias('h', 'help')
  .example('$ $0 https://example.com', 'Scan a single target')
  .example('$ $0 example.com example.com/foo',
    'Scan multiple targets; exit immediately if an error occurs')
  .example('$ $0 --config targets.json', 'Scan targets from a config file');
const argv = yargs.argv;

if (argv._.length == 0 && !argv.config) {
  yargs.showHelp();
  console.log('You must provide either an argument or a configuration file');
  process.exit(1);
}

var targetsChecked = 0;
var mcWarnings = 0;
var mcErrors = 0;
var cleanTargets = 0;
var dirtyTargets = 0;

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const failedReqs = {};

  page.on('requestfailed', r => {
    failedReqs[r._requestId] = r.url;
  });

  page._client.on('Network.loadingFailed', r => {
    if (r['blockedReason'] == 'mixed-content') {
      console.log(chalk.red('\tBlockable: ') + failedReqs[r['requestId']]);
      mcErrors++;
    }
  });

  page._client.on('Network.requestWillBeSent', r => {
    if (r['request']['mixedContentType'] == 'optionally-blockable') {
      console.log(chalk.yellow('\tOptionally blockable: ') + r.request.url);
      mcWarnings++;
    }
  });

  targets = argv._.concat(argv.targets).filter(Boolean);

  for (let t of targets) {
    if (t.startsWith('http://')) {
      t = t.replace(/^http:\/\//i, 'https://');
    } else if (!t.startsWith('https://')) {
      t = 'https://' + t;
    }

    console.log(chalk.cyan('Checking ') + t + ' ...');

    try {
      await page.goto(t);
      targetsChecked++;
    } catch(e) {
      console.log('\t'+chalk.red(e));
      if (argv.errexit) {
        summary();
        process.exit(1);
      }
    }
  }

  summary();
  browser.close();
})();

function summary() {
  console.log(
    '\nTargets checked: '                         + targetsChecked +
    '\nErrors (blockable content): '              + mcErrors       +
    '\nWarnings (optionally blockable content): ' + mcWarnings
  );
}
