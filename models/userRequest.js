var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var userRequestSchema = mongoose.Schema({
  rid: String,
  sid: String,
  requests: String,
});

var userRequest = mongoose.model("userRequest", userRequestSchema);
module.exports.userRequest = userRequest;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
