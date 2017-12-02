var mongoose = require('mongoose');

// define the schema for our user model
var kisaanSchema = mongoose.Schema({
  name: String,
  aadhar: String,
  mobile: String,
  kychash: String,
  ethereumAddress: String
});

// create the model for kisaan and expose it to our app
module.exports = mongoose.model('Kisaan', kisaanSchema);
