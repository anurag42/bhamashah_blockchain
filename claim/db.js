var claimTxn = require('./model');

module.exports = {
  createNewClaimEntry: function(req, res, callback) {
    var newTxn = new claimTxn();
    console.log("createEntry");
    newTxn.sender = req.body.address;
    newTxn.dealer = req.body.dealer;
    newTxn.amount = req.body.amount;
    newTxn.txnID = "None";
    newTxn.status = "Awaiting deposit from kisaan";
    newTxn.save(function(err, claimTxn) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Claim txn entry created in Mongo DB");
      callback(newTxn.id);
    });
  },

  getListOfClaims: function(callback) {
    claimTxn.find({}, callback);
  },

  getClaimsByFarmerName: function(kisaan_name, callback) {
    claimTxn.find({
      'sender': kisaan_name
    }, callback);
  },

  updateExchangeEntry: function(query, update) {
    var options = {
      multi: true
    };
    claimTxn.update(query, update, options, function(err, num) {
      console.log(num);
      console.log("Claim Txn Entry Updated");
    });
  }
};
