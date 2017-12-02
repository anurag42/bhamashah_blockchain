var config = require('../config.js');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));
var session = require('express-session');
var claimdb = require('./db');
var User = require('../user/model');
var userdb = require('../user/db');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var fertTokenContract = web3.eth.contract(fertTokenABI);
var tokenContractFunctions = require('../contract\ functions/fertToken.js');

module.exports = {
  redeem: function(req, res) {
    var pendingTasks = [createDBEntry, transferZen, deductBalance, sendResponse];

    function next(rslt) {
      var currentTask = pendingTasks.shift();
      if (currentTask) currentTask(rslt);
    }

    next();

    function createDBEntry() {
      console.log("Creating redemption DB entry");
      console.log(req.body);
      claimdb.createNewRedeemEntry(req, res, next);
    }

    function transferZen(claimID) {
      tokenContractFunctions.recordRedemption(req.body.address, parseInt(req.body.amount), next);
    }

    function deductBalance(){
      User.findOne({
      'ethereumAddress': req.body.address
    }, function(err, user){
      user.inrBalance += parseInt(req.body.amount);
      user.save();
      next();
    });
    }

    function sendResponse() {
      console.log("Response sent");
      res.send({
        status: "Successful"
      });
    }
  }
};
