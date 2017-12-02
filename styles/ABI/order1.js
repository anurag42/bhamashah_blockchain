orderABI = [{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"docName","type":"bytes32"},{"name":"_hash","type":"bytes"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"docdir","outputs":[{"name":"sender","type":"address"},{"name":"status","type":"uint8"},{"name":"index","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"docName","type":"bytes32"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"docName","type":"bytes32"},{"name":"version","type":"uint256"}],"name":"getDoc","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"docName","type":"bytes32"},{"name":"reason","type":"string"}],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"docName","type":"bytes32"}],"name":"getLatestDoc","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_buyer","type":"address"},{"name":"_seller","type":"address"},{"name":"_buyerBank","type":"address"},{"name":"_sellerBank","type":"address"},{"name":"_shipper","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"Buyer","type":"address"},{"indexed":false,"name":"Seller","type":"address"},{"indexed":false,"name":"BuyerBank","type":"address"},{"indexed":false,"name":"SellerBank","type":"address"},{"indexed":false,"name":"Shipper","type":"address"}],"name":"LogSetup","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"docName","type":"bytes32"},{"indexed":false,"name":"hash","type":"bytes"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"status","type":"uint8"},{"indexed":false,"name":"index","type":"uint256"}],"name":"LogUpload","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"docName","type":"bytes32"},{"indexed":false,"name":"sender","type":"address"}],"name":"LogApprove","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"docName","type":"bytes32"},{"indexed":false,"name":"sender","type":"address"}],"name":"LogReject","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hash","type":"bytes"}],"name":"LogGetDoc","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"s","type":"string"}],"name":"check","type":"event"}];
