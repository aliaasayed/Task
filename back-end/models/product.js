var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var products = new Schema({
  title: {
    type: String
  },
  price: {
    type: Number
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  image: String,
});

mongoose.model("products", products);
