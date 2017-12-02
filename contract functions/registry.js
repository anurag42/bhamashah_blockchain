var Web3 = require('web3');
var web3 = new Web3();
var config = require('../config.js');
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var registryContract = web3.eth.contract(fertTokenABI);
var registrydb = require('../registry/db.js');
var ipfs = require('../file/ipfs');
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));

module.exports = {
  submitKYC: function(req, res, userID, registryAddress, aadhaarID, userEthAddress, KYCHash) {
    var registryInstance = registryContract.at(registryAddress);
    var hashArr = str2bytearr(KYCHash);
    console.log(userEthAddress, hashArr);
    gasUsage = (registryInstance.submitKYC.estimateGas(aadhaarID, userEthAddress, hashArr) < config.gasUsage) ? registryInstance.submitKYC.estimateGas(aadhaarID, userEthAddress, hashArr) : config.gasUsage;
    var params = {
      gas: gasUsage,
      gasPrice: config.gasPrice,
      from: config.ethAddress
    };
    registryInstance.submitKYC.sendTransaction(aadhaarID, userEthAddress, hashArr, params, submitKYCcallback.bind({
      'registryInstance': registryInstance,
      'req': req,
      'res': res,
      'ethAddress': userEthAddress,
      'userID': userID
    }));
  },

  getKYChash: function(req, res, usrHash) {
    var registryInstance = registryContract.at(config.tokenAddress);
    gasUsage = (registryInstance.getKYChash.estimateGas(usrHash) < config.gasUsage) ? registryInstance.getKYChash.estimateGas(usrHash) : config.gasUsage;
    var params = {
      gas: gasUsage,
      gasPrice: config.gasPrice,
      from: config.ethAddress
    };
    registryInstance.getKYChash.sendTransaction(usrHash, params, getKYChashcallback.bind({
      'registryInstance': registryInstance,
      'userHash': usrHash,
      'req': req,
      'res': res
    }));
  }
}

function getKYChashcallback(error, result) {
  if (error) {
    console.error(error);
    return 'empty';
  }
  watchGetKYC(this.userHash, this.req, this.res);
  return;
}

function watchGetKYC(userHash, req, res) {
  console.log("Watch get KYC");
  var registryInstance = registryContract.at(config.tokenAddress);
  registryInstance.LogGetKYChash().stopWatching();
  registryInstance.LogGetKYChash({
    'ethAddress': userHash
  }).watch(function(e, log) {
    if (e) {
      return console.error(e);
    }
    registryInstance.LogGetKYChash().stopWatching();
    console.log('KYC Hash retrieved from registry contract');
    ipfs.download(hexToString(log.args.hash), res);
    return;
  });
}

function submitKYCcallback(error, result) {
  if (error) {
    console.error(error);
    return 'empty';
  }
  watchSubmitKYC(this.registryInstance, this.req, this.res, this.userID);
}

function watchSubmitKYC(registryInstance, req, res, userID) {
  ethAddress = this.ethAddress;
  registryInstance.LogSubmitted().stopWatching();
  registryInstance.LogSubmitted({
    'ethAddress': ethAddress
  }).watch(function(e, log) {
    if (e) {
      return console.error(e);
    }
    registryInstance.LogSubmitted().stopWatching();
    console.log('KYC Hash submitted to the registry contract');
    req.session.userId = userID;
    res.render('profile.ejs', {
      'user': userID,
      'kisaanList': [],
      'kisaanAadharList': []
    });
    return;
  });
}

function str2bytearr(str) {
  var data = [];
  for (var i = 0; i < str.length; i++) {
    data.push(str.charCodeAt(i));
  }
  return data;
}

function hexToString(hex) {
  var string = '';
  hex = hex.slice(2);
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  var list = string.slice(1, string.length - 1).split(',');
  var result = "";
  for (var i = 0; i < list.length; i++) {
    result += String.fromCharCode(parseInt(list[i]));
  }
  return result;
}