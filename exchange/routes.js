var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var exchangeEntry = require('./impl');

module.exports = function(app) {
  app.get('/tradeCoins', exchangeEntry.getTradeCoins);
  app.post('/tradeCoins', exchangeEntry.postTradeCoins);
  app.get('/checkbalance', exchangeEntry.getZenBalance);
  app.post('/checkbalance', exchangeEntry.postZenBalance);
  app.post('/recordFertIssue', exchangeEntry.recordIssuance);
};
