var Kisaan = require('./model');
var session = require('express-session');
module.exports = {

  getKisaanFromAadhar: function(aadhar, callback) {
    Kisaan.findOne({
      'aadhar': aadhar
    }, callback);
  },

  createNewKisaan: function(account, aadhar, mobile, callback) {
    var newKisaan = new Kisaan();
    newKisaan.aadhar = aadhar;
    newKisaan.mobile = mobile;
    newKisaan.ethereumAddress = account;
    newKisaan.save(callback);
  },

  getKisaanList: function(callback) {
    Kisaan.find({}, callback);
  },

  getKisaanFromAadharAndMobile: function(aadhar, mobile, callback) {
    Kisaan.findOne({
      'aadhar': aadhar,
      'mobile': mobile
    }, callback);
  },
  getKisaanfromID: function(id, callback) {
    console.log(id);
    Kisaan.findOne({
      '_id': id
    }, callback);
  }

};
