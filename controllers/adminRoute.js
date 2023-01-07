const express = require("express");
const router = express.Router();
const { userProfiles } = require("../models/userProfile");
const { userRequest } = require("../models/userRequest");
const { report } = require("../models/report");

// Router for getting all  users
const AllUser = async (req, res) => {
    try {
        const user = await userProfiles.find();
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

const DeleteUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userProfiles.findByIdAndDelete({
            _id: id
        })
        res.status(200).json({
            message: "User has been deleted"
        })
    } catch (error) {
        res.status(500).json({
            error: err
        })
    }
}

const BlockUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userProfiles.findById({
            _id: id
        })
        user.BlockStatus = true
        await user.save();
        res.status(200).json({
            message: "User has been blocked successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }
}

const ViewOnlineUsers = async (req, res) => {
    try {
        const OnlineUsers = await userProfiles.find({ LoginStatus: true })
        res.status(200).json({
            data: OnlineUsers
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }
}

const viewAllRequest = async (req, res) => {
    try {
        let user = await userRequest.find();
        let ridUser;
        let sidUser;
        let rid = [];
        let sid = [];
        for (let i = 0; i < user.length; i++) {
            rid[i] = user[i].rid;
            sid[i] = user[i].sid;
            ridUser = await userProfiles.find({ _id: rid[i] })
            sidUser = await userProfiles.find({ _id: sid[i] })

        }
        return res.status(200).json({ rid: ridUser, sid: sidUser });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const generateReport = async (req, res) => {
    const complainerId = req.body.complainerId;
    const complainedId = req.body.complainedId;
    const reportText = req.body.reportText;

    try {
        const newReport = new report({
            complainerId: complainerId,
            complainedId: complainedId,
            report: reportText
        });
        await newReport.save();
        res.status(201).json({ message: 'Report generated successfully' });

    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            error: error
        })
    }
}


module.exports = {
    AllUser,
    DeleteUser,
    BlockUser,
    ViewOnlineUsers,
    viewAllRequest,
    generateReport
};