var session = require('express-session');
var kisaan = require('./impl');

module.exports = function(app) {
  app.post('/validateAadhar', kisaan.validateAadhar);
  app.post('/validateOTP', kisaan.validateOTP);
  app.get('/kisaanlogin', kisaan.kisaanLogin);
  app.get('/kisaanprofile', kisaan.getKisaanProfile)
  app.post('/kisaanlogin', kisaan.successfulLogin);
  app.post('/validateKYC', kisaan.validateKYC);
};
