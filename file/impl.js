/* Importing Modules */
var fs = require("fs");
const bs58 = require('bs58');
const url = require('url');
var multer = require('multer');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

/* Import schema required for this app */
var User = require('../user/model');
var userdb = require('../user/db');
var Registry = require('../registry/model.js');
var registrydb = require('../registry/db.js');

/* Config File */
var config = require('../config.js');

/* Web3 Configuration Options */
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));

/* IPFS Function Provider */
var ipfs = require('./ipfs');

/* Smart Contract Function Provider */
var tokenFunctions = require('../contract\ functions/fertToken.js');
var registryFunctions = require('../contract\ functions/registry.js');

/* Trade Contract ABI and Binary Code */
require('../build/ABI/fertToken.js');
require('../build/Binary\ Code/fertToken.js');
var fertTokenContract = web3.eth.contract(fertTokenABI);

var gasUsage, docHash, dwnldDoc, registryAddress, completedDocs;

/* Triggered on each server start
   Checks if the contract is already deployed
   If not, it then deploys the contract from config.ethAddress */
checkIfContractDeployed(registryAddress);

/* -------FIX NEEDED---------
   Ideally checkIfRegistryDeployed() should not trigger deploy()
   But this problem is identified while running on AWS
   To bypass the issue, we set a Gloabl Variable
   -------FIX NEEDED----------*/
registryAddress = config.tokenAddress;

module.exports = {
  fileupload: function(req, res, callback) {
    console.log("Hello", req.files);
    fs.readFile(req.files[0].path, function(err, data) {
      ipfs.upload(data, callback);
    });
  },
  filedownload: function(req, res) {
    ipfs.download(req.body.kychash, res);
  },

  getKYChash: function(req, res) {
    var usrHash = req.body.usrHash;
    registryFunctions.getKYChash(req, res, usrHash);
  }
};

function deployContract() {
var _initialAmount = 20000;
  var _tokenName = "Zeon";
  var _decimalUnits = 3;
  var _tokenSymbol = "Zen";
  var _ownerID =  "656979695441";
  fertTokenContract.new(
   _initialAmount,
   _tokenName,
   _decimalUnits,
   _tokenSymbol,
   _ownerID,
   {
     from: config.ethAddress, 
     data: fertTokenContractCode, 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
         registrydb.saveRegistryAddress(contract.address);
    }
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

function uploadCallback(err, hash) {
  var req = this.req;
  var res = this.res;
  if (err) {
    console.error(err);
    res.send(err);
  }

  userdb.findUserByUsername(req.body.username, req, res, function(err, user) {
    if (!err) {
      user.local.kychash.push(hash[0].hash);
      user.save();
      var registryInstance = registryContract.at(registryAddress);
      registryFunctions.submitKYC(req, res, registryInstance, user.local.userHash, hash[0].hash, IsDocUploadComplete.bind({
        'req': req,
        'res': res
      }));
    }
  });
}

function redirectOnUpload(err, user) {
  var req = this.req;
  var res = this.res;
  req.session.userId = user._id;
  console.log("Session", req.session);
  res.redirect('/profile');
}

function redirectOnLOCDeploy(err, user) {
  var req = this.req;
  var res = this.res;
  req.session.tradesession = req.body.trade_id;
  res.redirect('/tradesession');
}

function onCreateNewUserCallback() {
  completedDocs = 0;
}

function onFindCustomer(err, customer) {
  if (err)
    throw err;
  res = this.res;
  docHash = customer.kychash;
  ipfs.download(docHash, res);
}

function checkIfContractDeployed(registryAddress) {
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
      deployContract();
    }
  });
}

function onSendTxnGetKYC(err, result) {
  var registryInstance = this.registryInstance;
  if (err) {
    this.res.send(err);
    return;
  }
  registryFunctions.getKYChash(registryInstance, retrievedHash.bind({
    'res': this.res
  }));
}

function retrievedHash(err, docHash) {
  if (!err)
    ipfs.download(hexToString(docHash), this.res);
}

function redirectOnUpdation() {
  var req = this.req;
  var res = this.res;
  req.session.tradesession = this.tradeID;
  req.session.sender = req.body.senderpage;
  res.redirect('/tradesession');
}
