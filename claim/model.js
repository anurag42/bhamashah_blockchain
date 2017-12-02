var mongoose = require('mongoose');

// define the schema for our user model
var claimTxnSchema = mongoose.Schema({
  sender: String,
  dealer: String,
  amount: Number,
  txnID: String,
  status: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('claimTxn', claimTxnSchema);
