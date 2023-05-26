const express = require("express");
const router = express.Router();

// middleware
const auth = require("./../middleware/UserAuth");

// controllers
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");

// validator
const { check } = require("express-validator");

// Public || Get Register User
router.post(
  "/Register",
  [check("name", "name is Required").not().isEmpty()],
  [check("email", "email is Required").not().isEmpty()],
  [check("password", "password is Required").not().isEmpty()],
  loginController.register
);

// Public || Get Login User
router.post(
  "/Login",
  [check("email", "email is Required").not().isEmpty()],
  [check("password", "password is Required").not().isEmpty()],
  loginController.login
);

// auth
router.use(auth);

// Public || Get user Data
router.post(
  "/",
  [check("email", "email is Required").not().isEmpty()],
  userController.getUser
);

module.exports = router;
