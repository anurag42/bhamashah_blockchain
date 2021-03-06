var Trade = require('./model');
var session = require('express-session');
var customerdb = require('../customer/db');
module.exports = {
  findTradeByTradeObjectID: function(req, res, callback) {
    Trade.findOne({
      '_id': req.session.tradesession
    }, callback);
  },

  createNewTrade: function(req, res, callback) {
    var newTrade = new Trade();
    // set the user's local credentials
    tradeID = newTrade._id;
    newTrade.trade_id = newTrade._id;
    newTrade.type = req.body.tradetype;
    newTrade.paymentinfo.No_of_days = 0;
    newTrade.paymentinfo.Credit_Amount = 0;
    newTrade.status = "RFQ Not Uploaded";
    newTrade.doc.push({
      doctype: 'rfq',
      hash: 'No Request for Quotation till now',
      txnID: 'None'
    });
    newTrade.doc.push({
      doctype: 'quotation',
      hash: 'No Quotation till now',
      txnID: 'None'
    });
    newTrade.doc.push({
      doctype: 'po',
      hash: 'No Purchase Order till now',
      txnID: 'None'
    });
    newTrade.doc.push({
      doctype: 'invoice',
      hash: 'No Invoice till now',
      txnID: 'None'
    });
    newTrade.doc.push({
      doctype: 'billoflading',
      hash: 'No Bill of Lading till now',
      txnID: 'None'
    });
    newTrade.status = "Ethereum Transaction Pending!!! Check after 2 mins!!!";
    if (req.body.tradetype == "PARTSSUPPLIERTOOEM") {
      newTrade.bank_id = req.body.bank_id;
      newTrade.supplier_id = req.body.supplier_id;
      newTrade.manufacturer_id = req.body.manufacturer_id;
      newTrade.shipper_id = req.body.shipper_id;
      newTrade.save(callback);
    } else if (req.body.tradetype == "OEMTODEALER") {
      newTrade.dealer_id = req.body.dealer_id;
      newTrade.manufacturer_id = req.body.manufacturer_id;
      newTrade.shipper_id = req.body.shipper_id;
      newTrade.save(callback);
    } else if (req.body.tradetype == "DEALERTOCUSTOMER") {
      newTrade.dealer_id = req.body.dealer_id;
      newTrade.insurer_id = req.body.insurer_id;
      customerdb.getCustomerFromAadhar(req.body.aadhar, onFindCustomer.bind({
        'res': res,
        'req': req,
        'newTrade': newTrade,
        'callback': callback
      }));
    }
  },

  findTradeByTradeID: function(trade_id, req, res, callback) {
    Trade.findOne({
      'trade_id': trade_id
    }, callback);
  },

  updateTrade: function(query, update, callback) {
    var options = {
      multi: true
    };
    Trade.update(query, update, options, function(err, num) {
      console.error(err);
      if (!err && callback) callback();
    });
  },

  findTradeByCustomerID: function(customerID, callback) {
    console.log("DBCall");
    Trade.findOne({
      'customer_id': customerID
    }, callback)
  }

};

function onFindCustomer(err, customer) {
  if (err) {
    console.log(err);
    throw err;
  }
  req = this.req;
  res = this.res;
  newTrade = this.newTrade;
  callback = this.callback;
  newTrade.customer_id = customer._id;
  newTrade.status = "Ethereum Transaction Pending!!! Check after 2 mins!!!";
  if (customer.kychash) {
    newTrade.status = "Ethereum Transaction Pending!!! Check after 2 mins!!";
  }
  newTrade.save(callback);
}
