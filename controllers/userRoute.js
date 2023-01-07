const express = require("express");
// const { CustomError } = require("../lib/error");
const { userProfiles } = require("../models/userProfile");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { gallery } = require("../models/gallery");
let router = express.Router();

const createProfile = async (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
      }
      tokens = buffer.toString("hex");
      console.log(tokens);
      let user = await new userProfiles(req.body);
      user.resetToken = tokens;
      user.active = false;
      var randomstring = Math.random().toString(36).slice(-8);
      user.password = randomstring;
      if (!user) {
        // const error = new CustomError("user is not created", 400);
        // next(error);
        console.log("user is not created");
      }
      let datatosent = {
        message: "user created",
        user,
      };
      await user.generateHashedPassword();
      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "beautypalmist@gmail.com", // generated ethereal user
          pass: "yucshktuqvvvuprd", // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "beautypalmist@gmail.com",
        to: user.email, // list of receivers
        subject: `Confirm Your Email`, // Subject line

        html: `
    <p>You requested for Create Account</p>
    <h5>Your Email is ${req.body.email} and Password is ${randomstring} click in this <a href='http://localhost:4200/verify/${tokens}'>link</a> to active Your Account if you dont sent request to Create account then iqnore this message</h5>
    `,
      });
      return res.send(datatosent);
    });
  } catch (e) {
    // const error = new CustomError("Creation failed", 400);
    // next(error);
    console.log(e);
  }
};

const get = async (req, res, next) => {
  try {
    const id = req.body.id;
    let user = await userProfiles.findById(id);
    if (!user) {
      // const error = new CustomError("users not find", 400);
      // next(error);
      console.log("users not find");
    }
    let datatosent = {
      message: "user list",
      user,
    };
    // await user.save();
    return res.send(user);
  } catch (e) {
    // const error = new CustomError("fetching failed", 400);
    // next(error);
    console.log(e);
  }
};
const update = async (req, res, next) => {
  try {
    const id = req.body.id;
    console.log(req.body);
    let user = await userProfiles.findByIdAndUpdate(id, req.body);
    if (!user) {
      // const error = new CustomError("users not find", 400);
      // next(error);
    }

    // await user.save();
    return res.send(user);
  } catch (e) {
    // const error = new CustomError("updation failed", 400);
    // next(error);
    console.log(e);
  }
};

// const Profilelogin = async (req, res, next) => {
//     try {
//         let token = jwt.sign(
//             {
//                 _id: req.user._id,

//             },
//             "jwtPrivateKey"
//         );
//         let datatoRetuen = {
//             message: "Login Successfully",
//             token: token,

//             id: req.user._id,
//         };
//         const user = await userProfiles.findById({ _id: req.user._id })
//         user.LoginStatus = true;
//         await user.save();
//         return res.status(200).send(datatoRetuen);
//     } catch (e) {
//         return res.status(402).send({ error: "Something Goes wrong" });
//     }
// };

const Profilelogin = async (req, res, next) => {
  try {
    // Extract email and password from request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }

    // Find user with matching email and password
    const user = await userProfiles.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    // Generate JWT token
    // const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

    // Update user's login status
    await userProfiles.findOneAndUpdate(
      { _id: user._id },
      { $set: { LoginStatus: true } }
    );

    // Return login success response with token and user ID
    return res.status(200).send({
      message: "Login Successful",
      // token: token,
      id: user._id,
      user: user,
    });
  } catch (error) {
    // Return error response if something goes wrong
    return res;
  }
};

const confirmEmail = async (req, res) => {
  try {
    console.log(req.body.token);
    const user = await userProfiles.findOne({
      resetToken: req.body.token,
    });

    if (!user)
      return res.status(422).json({ error: "Try again session expired" });

    user.resetToken = "";
    user.active = true;
    await user.save();
    res.json({ message: "Email Approved" });
  } catch (err) {
    console.log(err);
  }
};

const otpVerification = async (req, res) => {
  try {
    console.log(req.body.email);
    const user = await userProfiles.findOne({
      email: req.body.email,
    });

    if (!user)
      return res.status(422).json({ error: "Try again session expired" });
    user.phoneactive = true;
    await user.save();
    res.json({ message: "Phone Number Approved" });
  } catch (err) {
    console.log(err);
  }
};

const blockUser = async (req, res) => {
  const { userId, loginId } = req.body; // Extract the user ID from the request body
  const blockedUser = { blockedUserId: userId, UserId: loginId }; // Create an object with the user ID to be added to the "block" array

  // Find the user document and update the "block" array by pushing the blocked user object
  userProfiles.findByIdAndUpdate(
    loginId,
    { $push: { Block: userId } },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(500).send(err); // Return an error if there was a problem updating the document
      }
      return res.send(user); // Return the updated user document
    }
  );
};

const changeLoginStatus = async (req, res) => {
  const { userId, LoginStatus } = req.body; // Extract the user ID and block status from the request body

  // Find the user document and update the "BlockStatus" field
  userProfiles.findByIdAndUpdate(
    userId,
    { LoginStatus: LoginStatus },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(500).send(err); // Return an error if there was a problem updating the document
      }
      return res.send(user); // Return the updated user document
    }
  );
};

const showBlockedUsers = async (req, res) => {
  try {
    const userId = req.body.id;
    const user = await userProfiles.findById(userId);
    const blockedUsers = await userProfiles.find({ _id: { $in: user.Block } });

    // Return the blocked user objects in the response
    res.status(200).json({ data: blockedUsers });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

const unblockUser = async (req, res) => {
  const userId = req.body.userId;
  const blockedUserId = req.body.blockedUserId;

  try {
    const user = await userProfiles.findByIdAndUpdate(
      userId,
      {
        $pull: {
          Block: blockedUserId,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "User unblocked successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error unblocking user",
      error: error,
    });
  }
};

const payment = async (req, res) => {
  // Get the payment amount from the request body
  const amount = req.body.amount;

  // Redirect to WhatsApp with the payment amount
  res.send(
    `https://api.whatsapp.com/send?phone=<YOUR_PHONE_NUMBER>&text=I%20would%20like%20to%20make%20a%20payment%20of%20${amount}}`
  );
  // res.redirect(`https://wa.me?text=I%20would%20like%20to%20make%20a%20payment%20of%20${amount}`);
};

const uploadAllImage = async (req, res, next) => {
  try {
    const { userId, private } = req.body;

    let subcategory = await new gallery();
    subcategory.image = req.file.path;
    subcategory.userId = userId;
    subcategory.private = private;
    await subcategory.save();
    let datatosent = {
      message: "image uploaded",
      subcategory,
    };
    return res.send(datatosent);
  } catch (e) {
    return res.send(e);
  }
};

const changeSingleImageStatus = async (req, res, next) => {
  try {
    const { id, private } = req.body;
    let gal = await gallery.findById(id);
    gal.private = private;
    await gal.save();

    let datatosent = {
      message: "statusChange",
      gal,
    };
    return res.send(datatosent);
  } catch (e) {
    return res.send(e);
  }
};
const changeAllSttaus = async (req, res, next) => {
  try {
    const { userId, private } = req.body;
    console.log(userId);
    let gal = await gallery.updateMany(
      { userId: userId },
      { private: private },
      { multi: true, upsert: true, new: true }
    );

    console.log(gal);
    let datatosent = {
      message: "statusChange",
      gal,
    };
    console.log(datatosent);
    return res.send(datatosent);
  } catch (e) {
    return res.send(e);
  }
};
const uploadProfileImage = async (req, res, next) => {
  try {
    const { userId } = req.body;
    let profile = await userProfiles.findById(userId);

    profile.image = req.file.path;
    await profile.save();

    let datatosent = {
      message: "image uploaded",
      profile,
    };
    return res.send(datatosent);
  } catch (e) {
    return res.send(e);
  }
};

const showAllImages = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let gal = await gallery.find({ userId: userId });

    let datatosent = {
      message: "AllImages",
      gal,
    };
    console.log(datatosent);
    return res.send(datatosent);
  } catch (e) {
    return res.send(e);
  }
};
const showPublicImages = async (req, res, next) => {
    try {
      const { userId } = req.body;
  
      let gal = await gallery.find({ userId: userId ,private:false});
  
      let datatosent = {
        message: "All Images",
        gal,
      };
      console.log(datatosent);
      return res.send(datatosent);
    } catch (e) {
      return res.send(e);
    }
  };

  const showOverallPublicImages = async (req, res, next) => {
    try {
    
  
      let gal = await gallery.find();
  
      let datatosent = {
        message: "All Images",
        gal,
      };
      console.log(datatosent);
      return res.send(datatosent);
    } catch (e) {
      return res.send(e);
    }
  };
module.exports = {
  createProfile,
  otpVerification,
  update,
  get,
  showOverallPublicImages,
  showPublicImages,
  showAllImages,
  changeSingleImageStatus,
  uploadAllImage,
  Profilelogin,
  confirmEmail,
  blockUser,
  changeAllSttaus,
  changeLoginStatus,
  showBlockedUsers,
  unblockUser,
  payment,
  uploadProfileImage,
};
