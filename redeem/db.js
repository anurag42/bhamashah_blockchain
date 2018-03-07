var redeemTxn = require('./model');

module.exports = {
  createNewRedeemEntry: function(req, res, callback) {
    var newTxn = new redeemTxn();
    console.log("createEntry");
    newTxn.dealer = req.body.address;
    newTxn.amount = req.body.amount;
    newTxn.txnID = "None";
    newTxn.status = "Awaiting deposit from kisaan";
    newTxn.save(function(err, redeemTxn) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Redeem txn entry created in Mongo DB");
      callback(newTxn.id);
    });
  },

  updateExchangeEntry: function(query, update) {
    var options = {
      multi: true
    };
    redeemTxn.update(query, update, options, function(err, num) {
      console.log(num);
      console.log("Redeem Txn Entry Updated");
    });
  }
};
