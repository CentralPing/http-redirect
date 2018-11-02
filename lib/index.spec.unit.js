const redirect = require('./index');

describe('[Unit] `index`', () => {
  it('should be a function', () => {
    expect(redirect).toBeInstanceOf(Function);
  });
});
