var express = require("express");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({ extended: true });
var router = express.Router();

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var UserModel = mongoose.model("users");

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
    res.header('Access-Control-Allow-Credentials', true);

    next();
});


router.post("/signUp", urlEncodedMid, function (req, res) {

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);

    var user = new UserModel({
        email: req.body.email,
        password: hashedPassword,
        createdAt: new Date()
    });

    saveUser(user, function (data) {
        console.log();

        if (data == true)
            res.json({
                statusCode: 200, message: "user register successfully your account will be activated after 3 minutes"
            });
        else
            res.json({ statusCode: 404, message: data });
    });
});

router.post("/login", urlEncodedMid, function (req, res) {
    UserModel.findOne({
        email: req.body.email,
    },
        function (err, data) {
            if (data != null && !err) {
                checkPassword(req, data.password,
                    function (err, valid) {
                        if (err || !valid) {
                            res.json({
                                statusCode: 404,
                                message: "invalid email or password"
                            });
                            return;
                        }

                        var minutes = new Date(new Date() - new Date(data.createdAt)).getMinutes();
                        if (minutes < 3) {
                            res.json({
                                statusCode: 404,
                                message: "your account not activated yet"
                            });
                            return;
                        }
                        else {
                            res.json({
                                statusCode: 200,
                                success: true,
                                user: data
                            });
                        }
                    });
            }
            else {
                res.json({
                    statusCode: 404,
                    message: "invalid email or password"
                });
            }
        });

});

function saveUser(user, cb) {
    isUserExist(user.email, function (userData) {
        console.log(userData);

        if (!userData) {
            user.save(function (err, doc) {
                if (!err)
                    cb(true);
                else
                    cb("cannot save user data");
            });
        }
        else
            cb("email is already exist");
    });
}

function isUserExist(userEmail, cb) {
    console.log(userEmail);

    UserModel.findOne({ email: userEmail },
        function (err, data) {
            console.log(err);
            console.log(data);

            if (!err)
                if (data == null)
                    cb(false);
                else
                    cb(true);
            else
                cb(false);
        });
}

function checkPassword(req, hashedPassword, callback) {
    bcrypt.compare(req.body.password, hashedPassword,
        function (err, valid) {
            if (err || !valid)
                return callback("NotMatchPasswordOrPincode");
            return callback(null, valid);
        });
}

module.exports = router;
