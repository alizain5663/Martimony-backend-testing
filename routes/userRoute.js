const express = require('express'); //import express

// 1.
const router = express.Router();
const { upload } = require("../multers/uploadmulter");
// 2.
const UserController = require('../controllers/userRoute');
// 3.
router.get('/getProfile', UserController.get);
router.post('/createProfile', UserController.createProfile);
router.post("/verify", UserController.confirmEmail)
router.post("/otpverify", UserController.otpVerification)
router.post("/userUpdate", UserController.update)
router.post("/Profilelogin", UserController.Profilelogin)
router.post("/blockUser", UserController.blockUser)
router.post("/changeLoginStatus", UserController.changeLoginStatus)
router.post("/showBlockedUsers", UserController.showBlockedUsers)
router.post("/unblockUser", UserController.unblockUser)
router.post("/payment", UserController.payment)
router.post("/imageUpload", upload.single("image"), UserController.uploadAllImage);
router.post("/changeAllSttaus",  UserController.changeAllSttaus);
router.post("/changeSingleImageStatus", UserController.changeSingleImageStatus);
router.post("/uploadProfileImage", UserController.changeSingleImageStatus);
router.post("/uploadProfileImage", upload.single("image"),UserController.uploadProfileImage);
router.post("/upload", upload.single("image"),UserController.uploadProfileImage);
router.post("/showImages",UserController.showAllImages);
router.post("/showPublicImages",UserController.showPublicImages);
router.post("/showOverallPublicImages",UserController.showOverallPublicImages);









// 4. 
module.exports = router; // export to use in server.js