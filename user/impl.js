var fs = require("fs");
var config = require('../config.js');
var file = require('../file/impl.js');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));
var session = require('express-session');
var userdb = require('./db');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var fertTokenContract = web3.eth.contract(fertTokenABI);


/* IPFS Function Provider */
var ipfs = require('../file/ipfs');

/* Smart Contract Function Provider */
var tokenFunctions = require('../contract\ functions/fertToken.js');
var registryFunctions = require('../contract\ functions/registry.js');

var tokenAddress = config.tokenAddress;

module.exports = {

  getIndex: function(req, res) {
    res.render('index.ejs');
  },

  getSignup: function(req, res) {
    res.render('signup.ejs', {
      message: req.session.message
    });
  },

  postSignup: function(req, res) {
    //Signup Code
    console.log('Signup Process - Generating IPFS Hash for KYC Docs....');
    userdb.findUserByUsername(req.body.username, req, res, ifUserFound.bind({
      'req': req,
      'res': res
    }));
  }, //End Of Signup Code

  getLogin: function(req, res) {
    res.render('login.ejs', {
      message: ""
    });
  },

  getCustomerLogin: function(req, res) {
    res.render('customerlogin.ejs');
  },

  postCustomerLogin: function(req, res) {
    res.render('customerlogin.ejs');
  },

  postLogin: function(req, res) {
    userdb.findUserByUsername(req.body.username, req, res, onFindUserLogin.bind({
      'req': req,
      'res': res
    }));
  },

  getProfile: function(req, res) {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      userdb.findUserByUserID(req, res, onFindUserProfile.bind({
        'req': req,
        'res': res
      }));
    }
  },

  getProfileDetails: function(req, res) {
    req.session.message = "";
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      userdb.findUserByUserID(req, res, onFindUserProfileDetails.bind({
        'req': req,
        'res': res
      }));
    }
  },

  logout: function(req, res) {
    req.session.destroy(function() {
      res.cookie("login.sess", "", {
        expires: new Date()
      });
      res.redirect('/login');
    });
  }
};

function onFindUserLogin(err, user) {
  if (err) {
    console.error(err);
    return err;
  }
  var req = this.req;
  var res = this.res;
  if (!user) {
    res.render('login.ejs', {
      message: "No Such User exists!!!"
    });
  } // if the user is found but the password is wrong
  else if (!user.validPassword(req.body.password)) {
    res.render('login.ejs', {
      message: "Wrong Password!!!"
    }); // create the loginMessage and save it to session as flashdata
  } // all is well, return successful user
  else {
    req.session.userId = user._id;
    req.session.message = "";
    console.log("Redirecting to profile");
    res.redirect('/profile');
  }
}

function onFindUserProfile(err, user) {
  if (err)
    return err;
  var req = this.req;
  var res = this.res;
  req.session.userAddress = user.ethereumAddress;
  console.log(user.transact_history);
  switch (user.role) {
    case "Retailer":
      var transactionToArray = new Array;
      var transactionAmountArray = new Array;
      console.log(user.transact_history.length);
      for (var i = 0; i < user.transact_history.length; ++i) {
        transactionToArray[i] = user.transact_history[i].to;
        transactionAmountArray[i] = user.transact_history[i].amount;
      }
      res.render('retailerlogin.ejs', {
        'user': user,
        'transactionToArray': transactionToArray,
        'transactionAmountArray': transactionAmountArray
      });
      break;
    case "Admin":
      var kisaandb = require('../customer/db');
      kisaandb.getKisaanList(onKisaanList.bind({
        'res': res,
        'req': req,
        'user': user
      }));
      break;
  }
}

function onKisaanList(err, kisaan) {
  req = this.req;
  res = this.res;
  user = this.user;
  console.log(kisaan.length);
  var kisaanList = new Array;
  var kisaanAadharList = new Array;
  for (var i = 0; i < kisaan.length; ++i) {
    kisaanList[i] = kisaan[i].name;
    kisaanAadharList[i] = kisaan[i].aadhar;
  }
  console.log(kisaanAadharList);
  console.log(kisaanList);
  res.render('profile.ejs', {
    'user': user,
    'kisaanList': kisaanList,
    'kisaanAadharList': kisaanAadharList
  });
}

function onFindUserProfileDetails(err, user) {
  var registryInstance = fertTokenContract.at(config.tokenAddress);
  if (err)
    return err;
  var req = this.req;
  var res = this.res;
  if (user.role == 'Retailer') {
    res.render('retailerprofile.ejs', {
      ethBalance: registryInstance.balanceOf.call("656979695441"),
      user: user
    });
  } else {
    res.render('profiledetails.ejs', {
      ethBalance: registryInstance.balanceOf.call("656979695441"),
      user: user
    });
  }
}

function ifUserFound(err, user) {
  req = this.req;
  res = this.res;
  if (err)
    throw err;
  else if (user) {
    res.render('signup.ejs', {
      'message': "User Already Exists!"
    });
  } else {
    file.fileupload(req, res, onKYCUpload.bind({
      'req': req,
      'res': res
    }));
  }
}

function onKYCUpload(err, hash) {
  req = this.req;
  res = this.res;
  console.log(hash);
  //Create New Ethereum Account for User and store in DB
  userdb.createNewUser(web3.personal.newAccount(req.body.password), hash[0].hash, req, res, onCreateNewUserCallback.bind({
    'req': req,
    'res': res,
    'hash': hash
  }));
}

function onCreateNewUserCallback(err, user) {
  req = this.req;
  res = this.res;
  hash = this.hash;
  console.log("Creare", user);
  registryFunctions.submitKYC(req, res, user, tokenAddress, "656979695441", user.ethereumAddress, hash[0].hash);
}

function checkIfRegistryDeployed(registryAddress) {
  Registry.findOne({
    'deployed': 'Yes'
  }, function(err, Registry) {
    if (err)
      return err;
    if (Registry) {
      console.log('Registry Contract Already Deployed; Fetching from MONGO DB...');
      registryAddress = Registry.contract_id;
      console.log('Address of registry contract deployed:', registryAddress);
    } else {
      console.log('Deploying Registry Contract....');
      registryFunctions.deployRegistry();
    }
  });
}

function redirectOnUpload() {
  console.log("Redirecting");
  var req = this.req;
  var res = this.res;
  var user = this.user;
  req.session.userId = user._id;
  return res.redirect('/profile');
}