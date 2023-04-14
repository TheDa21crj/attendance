const jwt = require("jsonwebtoken");
const User = require("./../Schema/user");
const config = require("config");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const UserAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    const vToken = jwt.verify(token, config.get("jwtTokenAuth"));

    let data = await User.findOne({ email: "rishavraj@gmail.com" });

    console.log("vToken====================================================");
    console.log(vToken);
    console.log("data======================================================");
    console.log(data);

    const dataUser = await User.findOne({
      // _id: vToken._id,
      "tokens.token": token,
    });

    // console.log(token);
    console.log(dataUser);

    if (!dataUser) {
      throw new Error("Couldn't find");
    }

    req.token = token;
    req.dataUser = dataUser;
    req.userId = dataUser._id;

    next();
  } catch (error) {
    res.status(401).json({ errors: error });
  }
};

module.exports = UserAuth;
