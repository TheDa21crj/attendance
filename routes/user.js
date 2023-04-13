const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("./../Schema/user");
const UserAuth = require("./../middleware/UserAuth");

// Public
router.post(
  "/start",
  [check("values", "values is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { values } = req.body;

    try {
      console.log(values);
      console.log(typeof values);
      return res.status(202).json("Success");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);

// Public | User Register | /api/register
router.post(
  "/register",
  [
    check("email", "email is Required").not().isEmpty(),
    check("password", "Password is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: `User Already Exists` });
      }
      console.log(req.body);

      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      user = new User({
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(202).json({ message: `User Registered` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

// Public | User Login | api/login
router.post(
  "/login",
  [
    check("email", "email is Required").not().isEmpty(),
    check("password", "Password is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }

      let token = await user.generateToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      res.status(202).send({ message: `Token = ${token}` });
    } catch (error) {
      console.log(error);
    }
  }
);

// Private || Account Data || api/account
router.get("/account", UserAuth, async (req, res) => {
  res.status(200).send({ message: req.dataUser });
});

// Private || Logout || api/logout
router.get("/logout", async (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).send({ message: "Logout" });
});

module.exports = router;
