'use strict';

const debounce = require('p-debounce');
const { memoize } = require('cerebro-tools');
const icon = require('./assets/npm-logo.png');
const config = require('./config');

const fetchPackages = query => {
  return fetch(`https://api.npms.io/v2/search?q=${query}`)
    .then(response => response.json())
    .then(data => data.results);
};

const cachedFetchPackages = debounce(memoize(fetchPackages, config.memoization), config.debounce);

const extractQueryFromTerm = term => {
  const match = term.match(/^npm\s(.+)$/);
  if (!match) {
    return false;
  }

  return match[1].trim();
};

const displayResult = ({ display, actions }, result) => {
  const { name, description, links } = result.package;

  display({
    icon,
    id: `npm-${name}`,
    term: name,
    title: name,
    subtitle: description,
    clipboard: `npm i -S ${name}`,
    onSelect: event => {
      const { npm, repository } = links;
      const url = (event.altKey && repository) ? repository : npm;

      actions.open(url);
    }
  });
};

const fn = scope => {
  const { term, display, hide } = scope;
  const query = extractQueryFromTerm(term);

  if (query) {
    display({ icon, id: 'npm-loading', title: 'Searching NPM packages ...' });

    cachedFetchPackages(query)
      .then(results => {
        hide('npm-loading');

        results.slice(0, 10)
          .forEach(result => displayResult(scope, result));
      });
  }
};

module.exports = {
  icon,
  fn,
  keyword: 'npm',
  name: 'Search NPM packages'
};
