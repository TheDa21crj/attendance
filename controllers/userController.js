const HttpError = require("../models/HttpError");
const user = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const getUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  let users;
  try {
    users = await user.findOne({ email });

    if (users) {
      res.json({ users: users });
    } else {
      res.json({ message: "No user Found" });
    }
  } catch (err) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
};

exports.getUser = getUser;
