const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const AdminController = require('../controllers/adminRoute');
// 3.
router.get('/getallusers', AdminController.AllUser);
router.get('/deleteuser/:id', AdminController.DeleteUser);
router.get('/blockuser/:id', AdminController.BlockUser)
router.get('/ViewOnlineUsers', AdminController.ViewOnlineUsers)
router.get('/viewAllRequest', AdminController.viewAllRequest)
router.post("/generateReport", AdminController.generateReport)
// 4. 
module.exports = router; // export to use in server.js