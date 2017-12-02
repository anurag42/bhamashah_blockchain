var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var claimEntry = require('./impl');

module.exports = function(app) {
  app.post('/claimFertIssue', claimEntry.claimFertIssue);
};
