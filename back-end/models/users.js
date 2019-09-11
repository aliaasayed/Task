var mongoose = require("mongoose");

// ORM Mapping ...
var Schema = mongoose.Schema;

var users = new Schema({
    password: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    createdAt: {
        type: Date, required: true
    },
    tokens: Schema.Types.Mixed,
});

// Register ...
mongoose.model("users", users);
// Mongoose Hooks ...


