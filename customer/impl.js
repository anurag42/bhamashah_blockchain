var config = require('../config.js');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));
var session = require('express-session');
var kisaandb = require('./db');
const SendOtp = require('sendotp');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var registryContract = web3.eth.contract(fertTokenABI);

module.exports = {

  validateAadhar: function(req, res) {
    var aadhar = req.body.aadhar;
    kisaandb.getKisaanFromAadhar(aadhar, validateMobile.bind({
      'req': req,
      'res': res
    }));
  },

  validateKYC: function(req, res) {
    console.log("1");
    var mobile = req.body.mobile;
    var aadhar = req.body.aadhar;
    kisaandb.getKisaanFromAadharAndMobile(aadhar, mobile, validateKYCCallback.bind({
      'req': req,
      'res': res,
      'aadhar': aadhar,
      'mobile': mobile
    }));
  },

  kisaanLogin: function(req, res) {
    res.render('kisaanlogin.ejs');
  },

  getKisaanProfile: function(req, res) {
    kisaanID = req.query.kisaanid;
    kisaandb.getKisaanfromID(kisaanID, onFindKisaan.bind({
      'res': res
    }));
  },

  validateOTP: function(req, res) {
    var otp = req.body.otp;
    var mobile = '91' + req.body.mobile;
    const sendOtp = new SendOtp(config.MSG91_AUTH_KEY);
    sendOtp.verify(mobile, otp, function(error, data, response) {
      if (error) {
        res.send({
          success: "false",
          message: "Invalid OTP"
        });
      } else {
        res.send({
          success: "true"
        });
      }
    });
  },

  successfulLogin: function(req, res) {
    var aadhar = req.body.aadhar;
    kisaandb.getKisaanFromAadhar(aadhar, navigateToTrackerPage.bind({
      'req': req,
      'res': res
    }));
  }

}

function onFindKisaan(err, kisaan) {
  console.log(kisaan);
  var registryInstance = registryContract.at(config.tokenAddress);
  res = this.res;
  res.render('kisaanprofile.ejs', {
    'kisaan': kisaan,
    'ethBalance': registryInstance.balanceOf.call(kisaan.aadhar)
  });
}

function navigateToTrackerPage(err, kisaan) {
  if (err || !kisaan) {
    console.log(err);
    return err;
  }
  var res = this.res;
  var kisaanID = kisaan._id;
  res.redirect('/kisaanprofile?kisaanid=' + kisaanID);
}

function validateKYCCallback(err, kisaan) {
  var res = this.res;
  if (err) {
    console.error(err);
    res.send({
      success: "false"
    });
  }
  var kycExists = true;

  if (!kisaan) {
    kycExists = false;
    kisaandb.createNewKisaan(web3.personal.newAccount(this.aadhar), this.aadhar, this.mobile, function(response) {
      console.log(response);
    });
  } else {
    var kycHash = kisaan.kychash;
    if (!kycHash) {
      kycExists = false;
    }
  }
  res.send({
    success: "true",
    kycExists: kycExists,
    kisaan_id: kisaan._id,
    kisaanEthAddress: kisaan.ethereumAddress
  });

}

function validateMobile(err, kisaan) {
  if (err || !kisaan) {
    console.error(err);
    this.res.send({
      success: "false",
      message: "Kisaan with this Aadhar number does not exist!"
    });
  }

  var mobile = "91" + kisaan.mobile;
  const sendOtp = new SendOtp(config.MSG91_AUTH_KEY);
  sendOtp.send(mobile, "ZEONBC", function(error, data, response) {
    console.log(error);
    console.log(data);

  });
  this.res.send({
    success: "true",
    mobile: mobile
  });

}
