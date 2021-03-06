var User = require('./model');
var session = require('express-session');
module.exports = {

  findUserByUsername: function(username, req, res, callback) {
    User.findOne({
      'username': username
    }, callback);
  },
  findUserByEmail: function(email, req, res, callback) {
    User.findOne({
      'email': email
    }, callback);
  },
  findUserByUserID: function(req, res, callback) {
    User.findOne({
      '_id': req.session.userId
    }, callback);
  },
  findUserByAddress: function(req, res, callback) {
    User.findOne({
      'ethereumAddress': req.body.address
    }, callback);
  },
  createNewUser: function(account, hash, req, callback) {
    var newUser = new User();
    console.log("Aadhaar", req.body.aadhaarNo);
    // set the user's credentials
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = newUser.generateHash(req.body.password);
    newUser.role = req.body.role;
    newUser.kychash = hash;
    newUser.ethereumAddress = account;
    newUser.inrBalance = 0;
    newUser.aadhar = req.body.aadhaarNo;
    newUser.save(callback);
  },
  updateUser: function(query, update) {
    var options = {
      multi: true
    };
    User.update(query, update, options, function(err, num) {
      console.log(num);
    });
  }
};
