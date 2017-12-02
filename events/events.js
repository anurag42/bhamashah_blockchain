var events = require('events');
var eventEmitter = new events.EventEmitter();
var Web3 = require('web3');
var web3 = new Web3();
var config = require('../config.js');
web3.setProvider(new web3.providers.HttpProvider(config.web3Provider));
var Scheduler = require('mongo-scheduler');
var scheduler = new Scheduler("mongodb://localhost/db_name", {
  doNotFire: false
});
var tradedb = require('../trade/db');

require('../build/ABI/registry.js');
var registryContract = web3.eth.contract(registryABI);

module.exports = {
  paymentScheduler: function(time, days, tradeID) {
    console.log("schedule", time, days, tradeID);

    scheduler.on('PaymentProcessor', function() {
      payToSeller(tradeID);
      console.log('Scheduled');
    });

    var payEvent = {
      name: 'PaymentProcessor',
      after: new Date((time * 1000 + (days * 60 * 1000)))
    };

    scheduler.schedule(payEvent);
  }
};

function payToSeller(id) {
  console.log('Payment Initiated');
  var tradeInstance = registryContract.at(config.registryAddress);
  gasUsage = tradeInstance.payToSeller.estimateGas(id);
  var params = {
    gas: gasUsage,
    gasPrice: config.gasPrice,
    from: config.ethAddress
  };
  tradeInstance.payToSeller.sendTransaction(id, params, function(err, result) {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    }
    watchPayment(tradeInstance, id);
  });
}

function watchPayment(tradeInstance, id) {
  tradeInstance.LogPayment({
    'uid': id
  }).watch(function(e, log) {
    if (e) {
      return console.error(e);
    }
    console.log('Payment triggered from trade contract');
    var query = {
      trade_id: id
    };
    var update;
    if (log.args.status == "True") update = {
      status: 'Payment Successful'
    };
    else if (log.args.status == "False") update = {
      status: 'Payment Declined'
    };
    tradedb.updateTrade(query, update);
  });
}
