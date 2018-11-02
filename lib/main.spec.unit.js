const micro = require('micro');
const request = require('request-promise-native');
const listen = require('test-listen');

const redirect = require('./main');

const testRequestOptions = {
  resolveWithFullResponse: true,
  followRedirect: false,
  // Don't reject messages that come back with error code (e.g. 404, 500s)
  simple: false
};

describe('[Unit] `redirect`', () => {
  beforeEach(() => jest.resetModules());

  it('should export a config function', () => {
    expect(redirect).toBeInstanceOf(Function);
  });

  it('should throw an error without a specified URL to redirect to', () => {
    expect(() => redirect()).toThrow('A URL is required for redirects.');
  });

  it('should return a configured function from config exection', () => {
    expect(redirect('http://foo')).toBeInstanceOf(Function);
  });

  it('should return redirect responses with defaults', async () => {
    const redirector = redirect('http://foo');
    const router = micro((req, res) => {
      redirector(req, res);
      res.end();
    });
    const uri = await listen(router);
    const reqBase = request.defaults({baseUrl: uri});

    // Root request
    const resRoot = await reqBase({
      uri: '',
      ...testRequestOptions
    });
    expect(resRoot.statusCode).toBe(301);
    expect(resRoot.headers).toMatchObject({
      'location': 'http://foo/',
      'cache-control': 'public, immutable, s-maxage=31536000'
    });

    // Query parameters request
    const resQuery = await reqBase({
      uri: '',
      qs: {foo: 'bar'},
      ...testRequestOptions
    });
    expect(resQuery.statusCode).toBe(301);
    expect(resQuery.headers).toMatchObject({
      'location': 'http://foo/?foo=bar',
      'cache-control': 'public, immutable, s-maxage=31536000'
    });

    // Path request
    const resPath = await reqBase({
      uri: '/foo/bar',
      ...testRequestOptions
    });
    expect(resPath.statusCode).toBe(301);
    expect(resPath.headers).toMatchObject({
      'location': 'http://foo/foo/bar',
      'cache-control': 'public, immutable, s-maxage=31536000'
    });

    // Path and query parameter request
    const resPathQuery = await reqBase({
      uri: '/foo/bar',
      qs: {foo: 'bar'},
      ...testRequestOptions
    });
    expect(resPathQuery.statusCode).toBe(301);
    expect(resPathQuery.headers).toMatchObject({
      'location': 'http://foo/foo/bar?foo=bar',
      'cache-control': 'public, immutable, s-maxage=31536000'
    });
  });

  it('should return redirect responses with options', async () => {
    const redirector = redirect('http://foo', {
      statusCode: 302,
      headers: {'Cache-Control': 'no-cache'}
    });
    const router = micro((req, res) => {
      redirector(req, res);
      res.end();
    });
    const uri = await listen(router);
    const reqBase = request.defaults({baseUrl: uri});

    // Root request
    const res = await reqBase({
      uri: '',
      ...testRequestOptions
    });
    expect(res.statusCode).toBe(302);
    expect(res.headers).toMatchObject({
      'location': 'http://foo/',
      'cache-control': 'no-cache'
    });
  });
});
