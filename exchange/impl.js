var config = require('../config.js');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));
var session = require('express-session');
var exchangedb = require('./db');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var fertTokenContract = web3.eth.contract(fertTokenABI);
var tokenContractFunctions = require('../contract\ functions/fertToken.js');

module.exports = {
  getTradeCoins: function(req, res) {
    res.render('tradeAsset.ejs');
  },

  postTradeCoins: function(req, res) {
    console.log("trade coins");
    var pendingTasks = [createDBEntry, depositEth, transferZen, sendResponse];

    function next(rslt) {
      var currentTask = pendingTasks.shift();
      if (currentTask) currentTask(rslt);
    }

    next();

    function createDBEntry() {
      console.log("Creating exchange DB entry");
      exchangedb.createNewExchangeEntry(req, res, next);
    }

    function depositEth(exchangeEntryID) {
      console.log("deposit");
      //tradeContractFunctions.sendDepositTxn(req, res, exchangeEntryID, exchangeEntryID, next);
      next();
    }

    function transferZen(exchangeEntryID) {
      tokenContractFunctions.sendTransferTxn(req, res, exchangeEntryID, next);
    }

    function sendResponse() {
      console.log("Response sent");
      res.send({
        status: "Successful"
      });
    }
  },

  getZenBalance: function(req, res) {
    res.render('checkBalance.ejs');
  },

  postZenBalance: function(req, res) {
    var registryInstance = fertTokenContract.at(config.tokenAddress);
    var zenbalance = registryInstance.balanceOf.call(req.body.address);
    var ethBalance = web3.fromWei(web3.eth.getBalance(req.body.address.toString()), "ether");
    res.send({
      'zenBalance': zenbalance,
      'ethBalance': ethBalance
    });
  },

  recordIssuance: function(req, res) {
    tokenContractFunctions.recordIssuance(req.body.userAddress, [req.body.kisaanAddress], [parseInt(req.body.amount)]);
    res.redirect('./profile');
  }
};
