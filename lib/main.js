// ESM syntax is supported.
// export {};

/**
 * @module httpRedirect
*/

/**
 * @name redirect
 * @description Configures a request handler for `http.Server` style servers.
 * @param {String} uri - the URI/URL to redirect HTTP request to.
 * @param {Object} [options] - optional configuration for HTTP response.
 * @param {Number} [options.statusCode=301] - the response HTTP status code.
 * @param {Object} [options.header] - any additional valid HTTP response header values.
 * @param {String} [options.header.cacheControl='public, immutable, s-maxage=31536000'] - the HTTP response header cache control.
 * @return {Function} - `http.Server` style request handler
 */
module.exports = (uri, {
  statusCode = 301,
  headers = {
    'Cache-Control': 'public, immutable, s-maxage=31536000'
  }
} = {}) => {
  if (uri === undefined) {
    throw new Error('A URL is required for redirects.');
  }

  const baseURI = uri.replace(/\/?$/, '');

  return ({url}, res) => {
    res.statusCode = statusCode;
    res.setHeader('Location', `${baseURI}${url}`);

    Object.entries(headers).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
  };
};
