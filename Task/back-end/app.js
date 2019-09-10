var express = require("express");

var fs = require("fs");
var server = express();
var path = require('path');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

server.use(bodyParser.json({ limit: "5mb" }))

server.use(function (req, resp, next) {
  resp.header("Access-Control-Allow-Origin", "http://localhost:4200");
  resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  resp.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
  resp.header('Access-Control-Allow-Credentials', true);

  next();
});

mongoose.connect("mongodb://localhost:27018/alamat");

fs.readdirSync(path.join(__dirname, "models")).forEach(function (filename) {
  require('./models/' + filename);
});


var userRouter = require("./controllers/users");
server.use("/users", userRouter);

var productRouter = require("./controllers/products");
server.use("/products", productRouter);

server = require('http').Server(server);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log("user connect");
  socket.on('new-message', data => {
    io.sockets.emit('broadcast', { description: 'There is some update please refresh the page' });
  });

});

server.listen(3000, function () {
  console.log("Starting listen...");
});





