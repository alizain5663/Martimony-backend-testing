const express = require("express");
const router = express.Router();
const { userProfiles } = require("../models/userProfile");
const { userRequest } = require("../models/userRequest");
const { chat } = require("../models/chat");

// Router for getting all  users
const postchat = async (req, res) => {
  try {
    const { id, name,senderId, receiverId, message } = req.body;
    console.log(id);
    const chats = await chat.findById(id);
    if (chats) {
      chats.messages.push({
        sender: senderId,
        message: message,
        name,
      
      });
      chats.total_messages= chats.total_messages + 1,
      await chats.save();
      res.status(200).send(chats);
    } else {
      const chats = await new chat();
      chats.members.push(senderId);
  
      chats.members.push(receiverId);
      chats.messages.push({
        sender: senderId,
        message: message,
        name,
     
      });
      console.log(chats);
      await chats.save();
      console.log(chats);
      res.status(200).send(chats);
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


const getChatGroup = async (req, res) => {
    try {
      const {  senderId, receiverId} = req.body;
      const chats = await chat.findOne({members:{ $all : [senderId, receiverId] }});
      if (chats) {
        res.status(200).send(chats);
      
      } else {
        
        res.status(200).send({chats:{}});

      }
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  };
  const getAllChat = async (req, res) => {
    try {
      const {id} = req.body;
      const chats = await chat.findById(id);
      if (chats) {
        res.status(200).send(chats);
      
      } else {
        
        res.status(400).send({error:"no chat found"});

      }
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  };


  const getAlluserChat = async (req, res) => {
    try {
      const {senderId} = req.body;
      console.log(senderId);
      const chats = await chat.find({members:{ $all : [senderId] }});
       
      if (chats) {
        res.status(200).send(chats);
      
      } else {
        
        res.status(400).send({error:"no chat found"});

      }
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  };
module.exports = {
    getAllChat,getChatGroup,postchat,getAlluserChat
};
