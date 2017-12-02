var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var redeemEntry = require('./impl');

module.exports = function(app) {
  app.post('/redeem', redeemEntry.redeem);
};
