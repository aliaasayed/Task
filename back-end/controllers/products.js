var express = require("express");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var mongoose = require("mongoose");
var ProductsModel = mongoose.model("products");
var BookingModel = mongoose.model("bookings");

var server = express();
server = require('http').Server(server);
var io = require('socket.io').listen(server);

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
  res.header('Access-Control-Allow-Credentials', true);

  next();
});
router.post("/add", urlEncodedMid, function (req, res) {
  var product = new ProductsModel({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    address: req.body.address,
    image: req.body.image,
  });

  product.save(function (err, doc) {
    if (!err) {
      res.json({
        statusCode: 200,
        message: "your product added successfully"
      });
    }
    else
      res.json({
        statusCode: 404,
        message: "cannot add product"
      });
  });
});

router.get("", function (req, res) {
  ProductsModel.find({}, function (err, data) {
    res.json({ statusCode: 200, data: data })
  });
});

router.get("/details/:pId", function (req, res) {
  ProductsModel.findOne({ _id: req.params.pId }, function (err, product) {
    if (product) {
      res.json({ statusCode: 200, data: product })
    }
    else {
      res.json({ statusCode: 404, message: "cannot find product" });
    }
  });
});

router.post("/update/:pId", urlEncodedMid, function (req, res) {
  res.json({
    statusCode: 200,
    message: "your booking done successfully"
  });
});

module.exports = router;