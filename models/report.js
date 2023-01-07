var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var complaintSchema = mongoose.Schema({
    complainerId: {
        type: String,
        required: true,
    },
    complainedId: {
        type: String,
        required: true,
    },
    report: {
        type: String,
        required: true,
    },

});

var report = mongoose.model("Report", complaintSchema);
module.exports.report = report;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
