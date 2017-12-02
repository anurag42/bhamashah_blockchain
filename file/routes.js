var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var file = require('./impl');
module.exports = function(app) {
  app.post('/filedownload', file.filedownload);
  app.post("/getKYChash", file.getKYChash);
};
