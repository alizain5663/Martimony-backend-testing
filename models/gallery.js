var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var gallerySchema = mongoose.Schema({

       
     image:String,
     private:Boolean,
     userId:String,
     
    
});

var gallery = mongoose.model("gallery", gallerySchema);
module.exports.gallery = gallery;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
