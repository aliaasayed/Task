var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bookings = new Schema({
    date: {
        type: String
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "product"
    }
});

mongoose.model("bookings", bookings);
