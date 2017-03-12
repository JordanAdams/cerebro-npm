const debounce = require('p-debounce');
const { memoize } = require('cerebro-tools');
const icon = require('./assets/npm-logo.png');
const config = require('./config');
const npm = require('./npm');

const searchPackages = debounce(memoize(npm.search, config.memoization), config.debounce);

const queryFromTerm = term => {
  const match = term.match(/^npm (.+)$/);
  return match ? match[1].trim() : null;
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
  const query = queryFromTerm(term);

  if (!query) {
    return null;
  }

  display({ icon, id: 'npm-loading', title: 'Searching NPM packages ...' });

  return searchPackages(query)
    .then(results => {
      hide('npm-loading');

      results.slice(0, 10)
        .forEach(result => displayResult(scope, result));
    });
};

module.exports = {
  icon,
  fn,
  keyword: config.plugin.keyword,
  name: 'Search NPM packages'
};
