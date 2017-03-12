require('babel-register'); // eslint-disable-line import/no-unassigned-import
const requireHacker = require('require-hacker');

requireHacker.hook('png', path => `module.exports = '${path}'`);
