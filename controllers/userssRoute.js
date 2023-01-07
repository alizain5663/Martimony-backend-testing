const express = require("express");
const { userProfiles } = require("../models/userProfile");
const { userRequest } = require("../models/userRequest");
const router = express.Router();
// const Booking = require('../models/booking');
// const Room = require('../models/room');

// Router for getting all online users
const OnlineUser = async (req, res) => {
  const { Gender } = req.body;
  try {
    if (Gender === "Male") {
      const user = await userProfiles.find({ gender: "Female" });
      return res.status(200).send(user);
    } else {
      const user = await userProfiles.find({ gender: "Male" });
      return res.status(200).send(user);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const nearBy = async (req, res) => {
  const { city } = req.body;

  try {
    const user = await userProfiles.find({ city: city });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const addToFav = async (req, res) => {
  const { uid, id } = req.body;
  try {
    const user = await userProfiles.findById(id);
    const check = user.favourites.some((val) => val == uid);
    if (check) {
      user.favourites = user.favourites.filter((val) => val != uid);
      await user.save();
    } else {
      user.favourites.push(uid);
      await user.save();
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const sentRequest = async (req, res) => {
  const { id, rid, request } = req.body;

  try {
    if (request == "sending") {
      let user = await new userRequest();
      (user.rid = rid),
        (user.sid = id),
        (user.requests = "pending"),
        await user.save();
      return res.status(200).send(user);
    } else if (request == "cancel") {
      let user = await userRequest.findOneAndUpdate(
        { sid: rid, rid: id },
        { requests: "cancel" }
      );
      console.log(user);
      return res.status(200).send(user);
    } else if (request == "accept") {
      let user = await userRequest.findOneAndUpdate(
        { sid: rid, rid: id },
        { requests: "accept" }
      );
      return res.status(200).send(user);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const viewRequest = async (req, res) => {
  const { uid, id, rid } = req.body;
  try {
    let user = await userRequest.findOne({
      rid: rid,
      sid: id,
    });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const viewAllRequest = async (req, res) => {
  const { rid } = req.body;
  try {
    let user = await userRequest.find({
      rid: rid,
    });
    const ids = user.map((val) => val.sid);
    let users = await userProfiles.find({ _id: { $in: ids } });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const viewFav = async (req, res) => {
  const { id } = req.body;
  try {
    let user = await userProfiles.findById(id);
    const ids = user.favourites;
    let users = await userProfiles.find({ _id: { $in: ids } });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
// const findMatch = async (req, res) => {
//   const { id } = req.body;
//   try {
//     let user = await userProfiles.findById(id);
//     let allUser = await userProfiles.aggregate(
//       [{
//         $match: {
//           status: user.status,
//           religiousStatus: user.religiousStatus,
//           professional: user.professional
//         }
//       }]
//     );
//     return res.status(200).send(allUser);
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// };

const findMatch = async (req, res) => {
  const userId = req.body.id;
  userProfiles.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    // Find profiles with at least 5 matching fields and exclude the logged in user
    userProfiles.find(
      {
        _id: { $ne: userId, $nin: user.Block },
        gender: { $in: ["Male", "Female"].filter((g) => g !== user.gender) },
        $and: [
          {
            age: { $gte: parseInt(user.age) - 2, $lte: parseInt(user.age) + 2 },
          },
          { status: user.status },
          { religious: user.religious },
          { otherreligion: user.otherreligion },
          { sect: user.sect },
          { professional: user.professional },
          // { income: user.income },
          // Other fields here
        ],
      },
      (err, profiles) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send(profiles);
      }
    );
  });
};

const search = async (req, res) => {
  // Extract the search query from the request body
  const { gender, max_age, min_age, country, userId } = req.body;

  // Use the find method to search for documents in the collection
  userProfiles.find(
    {
      _id: { $ne: userId },
      gender: gender,
      age: { $gte: parseInt(min_age), $lte: parseInt(max_age) },
      country: country,
    },
    (err, users) => {
      if (err) {
        return res.status(500).send(err);
      }
      // Return the search results
      return res.send(users);
    }
  );
};

module.exports = {
  OnlineUser,
  addToFav,
  sentRequest,
  viewRequest,
  viewFav,
  nearBy,
  findMatch,
  viewAllRequest,
  search,
};
