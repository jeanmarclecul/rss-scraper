const app = require('../dist/server/index.js');

function handler(req, res) {
  app(req, res);
}

module.exports = handler;