# @CentralPing/http-redirect

[![Build Status](https://travis-ci.org/CentralPing/http-redirect.svg?branch=master)](https://travis-ci.org/CentralPing/http-redirect)
[![Coverage Status](https://coveralls.io/repos/github/CentralPing/http-redirect/badge.svg)](https://coveralls.io/github/CentralPing/http-redirect)
[![Dependency Status](https://david-dm.org/CentralPing/http-redirect.svg)](https://david-dm.org/CentralPing/http-redirect)
[![Greenkeeper Status](https://badges.greenkeeper.io/CentralPing/http-redirect.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/centralping/http-redirect/badge.svg)](https://snyk.io/test/github/centralping/http-redirect)

An HTTP request handler for node [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) style servers. It automatically sets the correct status code and headers for a response. Function invoctioners will still need to end the request manually.

## Notes

* The redirect URL is required.
* No safeguards against looped redirects.

## Installation

`npm i --save @centralping/http-redirect`

## API Reference

<a name="module_httpRedirect..redirect
Configures a request handler for `http.Server` style servers."></a>

### httpRedirect~redirect
Configures a request handler for `http.Server` style servers. ⇒ <code>function</code>
**Kind**: inner property of [<code>httpRedirect</code>](#module_httpRedirect)  
**Returns**: <code>function</code> - - `http.Server` style request handler  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| uri | <code>String</code> |  | the URI/URL to redirect HTTP request to. |
| [options] | <code>Object</code> |  | optional configuration for HTTP response. |
| [options.statusCode] | <code>Number</code> | <code>301</code> | the response HTTP status code. |
| [options.header] | <code>Object</code> |  | any additional valid HTTP response header values. |
| [options.header.cacheControl] | <code>String</code> | <code>&#x27;public, immutable, s-maxage&#x3D;31536000&#x27;</code> | the HTTP response header cache control. |


## Examples

### Procedural

```js
const redirect = require('@centralping/http-redirect');

const redirector = redirect('https://foo.bar');

const server = someServerCreator();

// Redirect all the things
server.route('*', (req, res) => {
  redirector(req, res);

  // Important!!
  res.end();
});
```

### Middleware

```js
const redirect = require('@centralping/http-redirect');

const redirector = redirect('https://foo.bar');

const server = someServerCreator();

// Redirect all the things
server.route('*', redirector, (req, res) => res.end());
```

## Test

`npm test`

With coverage reporting:

`npm test -- --coverage`

With file watch:

`npm run watch`

## License

MIT
