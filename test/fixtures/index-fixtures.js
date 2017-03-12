const sinon = require('sinon');

module.exports = {
  searchResults: [
    {
      package: {
        name: 'foo',
        description: 'foobar',
        links: {
          npm: 'https://npmjs.com/package/foo',
          repository: 'https://github.com/foo/bar'
        }
      }
    },
    {
      package: {
        name: 'baz',
        description: 'bazqux',
        links: {
          npm: 'https://npmjs.com/package/baz',
          repository: 'https://github.com/baz/qux'
        }
      }
    }
  ],
  terms: {
    invalid: [
      'foobar',
      'n',
      'np',
      'npm',
      'npmlol',
      'npm ',
      'npm76'
    ],
    valid: [
      {
        term: 'npm foo',
        query: 'foo'
      },
      {
        term: 'npm bar',
        query: 'bar'
      },
      {
        term: 'npm  baz ',
        query: 'baz'
      },
      {
        term: 'npm    qux      corge',
        query: 'qux      corge'
      },
      {
        term: 'npm npm',
        query: 'npm'
      },
      {
        term: 'npm 42',
        query: '42'
      }
    ]
  },
  displayResultMatcher: result => ({
    icon: sinon.match.any,
    id: `npm-${result.name}`,
    term: result.name,
    title: result.name,
    subtitle: result.description,
    clipboard: `npm i -S ${result.name}`,
    onSelect: sinon.match.func
  })
};
