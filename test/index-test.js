const { spy } = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('./utils/expect');
const fixtures = require('./fixtures/index-fixtures');

const icon = 'someicon';
const debounce = spy(fn => fn);
const memoize = spy(fn => fn);
const npm = {
  search: spy(() => Promise.resolve(fixtures.searchResults))
};

const plugin = proxyquire('../src/index', {
  'p-debounce': debounce,
  'cerebro-tools': { memoize },
  './npm': npm,
  './assets/npm-logo.png': icon
});

const itShouldIgnoreInvalidTerms = () => {
  fixtures.terms.invalid.forEach(term => {
    it(`should ignore the term: ${term}`, () => {
      const display = spy();
      const returned = plugin.fn({ display, term });

      expect(display.called).to.equal(false);
      expect(returned).to.equal(null);
    });
  });
};

const itShouldHandleValidTerms = () => {
  fixtures.terms.valid.forEach(({ term, query }) => {
    it(`should handle the term: "${term}"`, () => {
      const display = spy();
      const hide = spy();

      return plugin.fn({ display, hide, term })
        .then(() => {
          expect(display).to.have.callCount(3);
          expect(hide).to.have.callCount(1);
          expect(npm.search).to.have.been.calledOnce();

          expect(display).to.have.been.calledWithMatch({ icon, id: 'npm-loading', title: 'Searching NPM packages ...' });
          expect(hide).to.have.been.calledWithExactly('npm-loading');
          expect(npm.search).to.have.been.calledWithExactly(query);

          fixtures.searchResults.forEach(result => {
            const matcher = fixtures.displayResultMatcher(result.package);
            expect(display).to.have.been.calledWithMatch(matcher);
          });
        })
        .catch(err => console.error(err));
    });
  });
};

describe('plugin', () => {
  beforeEach(() => {
    debounce.reset();
    memoize.reset();
    npm.search.reset();
  });

  describe('fn()', () => {
    itShouldIgnoreInvalidTerms();
    itShouldHandleValidTerms();
  });
});
