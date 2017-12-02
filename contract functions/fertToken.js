var Web3 = require('web3');
var web3 = new Web3();
var exchangeTxn = require('../exchange/model');
var config = require('../config.js');
var exchangedb = require('../exchange/db');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var fertTokenContract = web3.eth.contract(fertTokenABI);
var ipfs = require('../file/ipfs');
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));

module.exports = {
  recordIssuance: function(sender, recepients, tokenAmounts, callback) {
    console.log("Recording Issuance of fertilizer", sender, recepients, tokenAmounts);
    var fertTokenInstance = fertTokenContract.at(config.tokenAddress);
    //gasUsage = (fertTokenInstance.recordFertIssue.estimateGas(sender, recepients, tokenAmounts) < config.gasUsage) ? fertTokenInstance.recordFertIssue.estimateGas(sender, recepients, tokenAmounts) : config.gasUsage;
    var params = {
      gas: 1000000,
      gasPrice: config.gasPrice,
      from: config.ethAddress
    };
    console.log("Sending Transaction to Blockchain");
    fertTokenInstance.recordFertIssue.sendTransaction(sender, recepients, tokenAmounts, params, recordIssuanceCallback.bind({
      'fertTokenInstance': fertTokenInstance,
      'sender': sender,
      'callback': callback
    }));
  },

  recordClaim: function(claimID, claimedBy, dealer, amount, callback) {
    console.log("Recording claim on Blockchain", claimID, claimedBy, dealer, amount);
    var fertTokenInstance = fertTokenContract.at(config.tokenAddress);
    var gasUsage = (fertTokenInstance.claimFert.estimateGas(claimID, claimedBy, dealer, amount) < config.gasUsage) ? fertTokenInstance.claimFert.estimateGas(claimID, claimedBy, dealer, amount) : config.gasUsage;
    var params = {
      gas: gasUsage,
      gasPrice: config.gasPrice,
      from: config.ethAddress
    };
    console.log("Sending Transaction to Blockchain");
    fertTokenInstance.claimFert.sendTransaction(claimID, claimedBy, dealer, amount, params, recordClaimCallback.bind({
      'fertTokenInstance': fertTokenInstance,
      'claimID': claimID,
      'callback': callback
    }));
  },

  recordRedemption: function(sender, redeemAmount, callback) {
    console.log("Recording redemption by dealer on Blockchain", sender, redeemAmount);
    var fertTokenInstance = fertTokenContract.at(config.tokenAddress);
    console.log('1');
    //gasUsage = (fertTokenInstance.redeem.estimateGas(sender, redeemAmount) < config.gasUsage) ? fertTokenInstance.redeem.estimateGas(sender, redeemAmount) : config.gasUsage;
    var params = {
      gas: 100000,
      gasPrice: config.gasPrice,
      from: config.ethAddress
    };
    //console.log(gasUsage);
    fertTokenInstance.redeem.sendTransaction(sender, redeemAmount, params, recordRedemptionCallback.bind({
      'fertTokenInstance': fertTokenInstance,
      'sender': sender,
      'callback': callback
    }));
  },

  sendTransferTxn: function(req, res, exchangeEntryID, callback) {
    console.log('sendTransferTxn');
    var fertTokenInstance = fertTokenContract.at(config.tokenAddress);
    var _to = req.body.address;
    //var _to = "0x7b542cff04e19cb3391e0cc7791f75da87c2f6c1";
    /* --------FIX NEEDED------
       Remove hardcoded value */
    var tokenAmount = req.body.amount * 1;
    gasUsage = (fertTokenInstance.transfer.estimateGas(_to, tokenAmount) < config.gasUsage) ? fertTokenInstance.transfer.estimateGas(_to, tokenAmount) : config.gasUsage;
    var params = {
      gas: gasUsage,
      gasPrice: config.gasPrice,
      from: config.ethAddress
    };
    fertTokenInstance.transfer.sendTransaction(_to, tokenAmount, params, function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      hasTokenTransferred(fertTokenInstance, _to, exchangeEntryID, result, callback);
    })
  }
}

function recordIssuanceCallback(error, result) {
  if (error) {
    console.error(error);
    response.send(error);
    return;
  }
  watchRecordIssuance(this.fertTokenInstance, this.sender, this.callback);
}

function watchRecordIssuance(fertTokenInstance, sender, callback) {
  console.log("Watching fertilizer token Issuance");
  fertTokenInstance.LogFertIssued({
    'sender': sender
  }).watch(function(e, log) {
    if (e) {
      console.error(e);
      return;
    }
    console.log('Token Issuance Successful');
    callback();
  });
}

function recordClaimCallback(error, result) {
  if (error) {
    console.error(error);
    response.send(error);
    return;
  }
  watchClaim(this.fertTokenInstance, this.claimID, this.callback);
}

function watchClaim(fertTokenInstance, claimID, callback) {
  console.log("Watching fertilizer token claim event");
  fertTokenInstance.LogFertClaimed({
    'uid': claimID
  }).watch(function(e, log) {
    if (e) {
      console.error(e);
      return;
    }
    console.log('Claim Successful');
    callback();
  });
}

function recordRedemptionCallback(error, result) {
  if (error) {
    console.error(error);
    response.send(error);
    return;
  }
  watchRedemption(this.fertTokenInstance, this.sender, this.callback);
}

function watchRedemption(fertTokenInstance, sender, callback) {
  console.log("Watching fertilizer token redemption event", sender);
  fertTokenInstance.LogRedeemed({
    'sender': sender
  }).watch(function(e, log) {
    if (e) {
      console.error(e);
      return;
    }
    console.log('Redemption Successful');
    callback();
  });
}

function hasTokenTransferred(tradeInstance, to, exchangeEntryID, txnId, callback) {
  console.log('hasTokenTransferred');
  tradeInstance.Transfer({
    '_to': to
  }).watch(function(e, log) {
    if (e) {
      return hadError(e, res);
    }
    console.log('Token transfer successful on Blockchain');
    var query = {
      'id': exchangeEntryID
    };
    var update = {
      'status': "Transfer successful",
      'transferTxnID': txnId
    };
    exchangedb.updateExchangeEntry(query, update);
    callback();
  });
}