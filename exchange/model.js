var mongoose = require('mongoose');

// define the schema for our user model
var exchangeTxnSchema = mongoose.Schema({
  sender: String,
  ethAmount: Number,
  depositTxnID: String,
  transferTxnID: String,
  status: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('exchangeTxn', exchangeTxnSchema);
