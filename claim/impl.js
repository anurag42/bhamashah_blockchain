var config = require('../config.js');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));
var session = require('express-session');
var claimdb = require('./db');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var fertTokenContract = web3.eth.contract(fertTokenABI);
var tokenContractFunctions = require('../contract\ functions/fertToken.js');

module.exports = {
  claimFertIssue: function(req, res) {
    var pendingTasks = [createDBEntry, transferZen, sendResponse];

    function next(rslt) {
      var currentTask = pendingTasks.shift();
      if (currentTask) currentTask(rslt);
    }

    next();

    function createDBEntry() {
      console.log("Creating claim DB entry");
      console.log(req.body);
      claimdb.createNewClaimEntry(req, res, next);
    }

    function transferZen(claimID) {
      tokenContractFunctions.recordClaim(claimID, req.body.address, req.body.dealer, req.body.amount, next);
    }

    function sendResponse() {
      console.log("Response sent");
      res.send({
        status: "Successful"
      });
    }
  }
};
