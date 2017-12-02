var session = require('express-session');
var user = require('./impl');

module.exports = function(app) {
  app.get('/', user.getIndex);
  app.get('/signup', user.getSignup);
  app.post('/signup', user.postSignup);
  app.get('/login', user.getLogin);
  app.get('/retailerlogin', user.getRetailerLogin);
  app.post('/login', user.postLogin);
  app.get('/profile', user.getProfile);
  app.get('/profiledetails', user.getProfileDetails);
  app.get('/logout', user.logout);
};
