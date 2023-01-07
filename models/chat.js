var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var chatSchema = mongoose.Schema({

       
        date: { type:Date ,default:Date.now},
        members: [],
        messages: [
          {
            name:String,
             sender: String, 
             message: String, 
          
          },],
       total_messages: {type:Number,default:0},
    
});

var chat = mongoose.model("chat", chatSchema);
module.exports.chat = chat;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
