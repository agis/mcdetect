# mcdetect - catch mixed content issues in the wild
[![NPM version](https://img.shields.io/npm/v/mcdetect.svg)](https://www.npmjs.com/package/mcdetect)

_mcdetect_ is a tool that detects [mixed content issues](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content)
with certainty.

![mcdetect demo](demo.gif)

## Motivation

Tools used to catch mixed content issues often rely
on parsing the DOM to determine if insecure content _will_ be loaded in a specific
page. Consequently they may report false negatives since not all such issues
can be detected statically.

_mcdetect_ can determine with absolute certainty if any mixed content
errors or warnings actually occur on a page. It does this by visiting
the pages and evaluating their Javascript like a regular browser would do.
In other words, it _does not report false negatives_.

It does this by leveraging [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)
that shipped with Chrome 59 and the [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

## Requirements

- Node 7.6.0 or later

## Installation

```shell
$ npm install -g mcdetect
```

## Usage

Checking a single target page:

```shell
$ mcdetect https://example.com https://google.com
```

Checking multiple targets (if no protocol is specified, it is assumed to be
"https://"):
```shell
$ mcdetect example.com google.com
```

Multiple targets can also be given via a config file:

```shell
$ cat my_urls.json
{
  "targets": [
    "googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/xmlhttprequest-example.html",
    "googlesamples.github.io/web-fundamentals/fundamentals/security/prevent-mixed-content/passive-mixed-content.html"
  ]
}

$ mcdetect --config my_urls.json
```

For more usage examples and options see `mcdetect --help`.

## TODO

- Add scraping mode (with max depth)
- More output formats (eg. json, csv, pdf)
- error handling (modes: exit on error, ignore errors, report errors)
- interactive mode
- follow redirects
- read targets from stdin

## License

mcdetect is licensed under MIT. See [LICENSE](LICENSE).
