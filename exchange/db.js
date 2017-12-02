var exchangeTxn = require('./model');

module.exports = {
  createNewExchangeEntry: function(req, res, callback) {
    var newTxn = new exchangeTxn();
    console.log("createEntry");
    newTxn.sender = req.body.address;
    newTxn.ethAmount = req.body.amount;
    newTxn.depositTxnID = "None";
    newTxn.transferTxnID = "None";
    newTxn.status = "Awaiting deposit from user";
    newTxn.save(function(err, exchangeTxn) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Exchange txn entry created in MOngo DB");
      callback(newTxn.id);
    });
  },
  updateExchangeEntry: function(query, update) {
    var options = {
      multi: true
    };
    exchangeTxn.update(query, update, options, function(err, num) {
      console.log(num);
      console.log("Exchange Txn Entry Updated");
    });
  }
};
