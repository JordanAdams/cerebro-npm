'use strict';
const icon = require('./assets/npm-logo.png');
const id = 'npm';

const fetchPackages = (query) => {
  console.log('query passed:', query)
  return fetch(`https://api.npms.io/v2/search?q=${query}`)
    .then(response => response.json())
    .then(data => data.results);
};

const extractQueryFromTerm = (term) => {
  const [_, query] = term.match(/^npm\s(.+)$/);
  return query.trim();
}

const displayResult = ({ display, actions }, result) => {
  display({
    icon,
    id: `npm-${result.package.name}`,
    term: result.package.name,
    title: result.package.name,
    subtitle: result.package.description,
    clipboard: `npm i -S ${result.package.name}`,
    onSelect: (event) => {
      const { npm, repository } = result.package.links;
      const url = event.altKey && repository ? repository : npm;
      actions.open(url);
    }
  });
};

const fn = (scope) => {
  const { term, display, hide, actions } = scope;

  const query = extractQueryFromTerm(term);

  if (query && query.length > 0) {
    display({ icon, id: 'npm-loading', title: 'Searching NPM packages ...' });

    fetchPackages(query).then(results => {
      hide('npm-loading');
      results
        .slice(0, 10)
        .map((result) => displayResult(scope, result));
    });
  }
};

module.exports = {
  icon,
  fn,
  keyword: 'npm',
  name: 'Search NPM packages'
}
