const { stub } = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('./utils/expect');
const fixtures = require('./fixtures/npm-fixtures');

const request = stub().returns(Promise.resolve({
  results: fixtures.results
}));

const npm = proxyquire('../src/npm', {
  'request-promise-native': request
});

describe('npm', () => {
  describe('search()', () => {
    it('should handle a search by calling npms.io', () => {
      return npm.search('foobar')
        .then(results => {
          expect(results).to.deep.equal(fixtures.results);

          expect(request).to.have.been.calledOnce();
          expect(request).to.have.been.calledWithMatch({
            url: 'https://api.npms.io/v2/search',
            qs: { query: 'foobar' },
            json: true
          });
        })
        .catch(err => console.error(err));
    });
  });
});
