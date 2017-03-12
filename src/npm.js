const request = require('request-promise-native');

module.exports = {
  search(query) {
    return request({
      url: 'https://api.npms.io/v2/search',
      qs: { q: query },
      json: true
    }).then(data => data.results);
  }
};
