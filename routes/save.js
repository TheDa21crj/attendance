const express = require("express");
const router = express.Router();

// validator
const { check } = require("express-validator");

// middleware
const auth = require("./../middleware/UserAuth");
// Route Controllers
const {
  startOrStopAttendance,
  start,
  view,
  toggleAdminAttendance,
} = require("../controllers/attendanceController");

// auth

// Public || Save Attendance
router.post(
  "/start",
  [check("values", "values is Required").not().isEmpty()],
  start
);

router.use(auth);

// Private || View Attendance
router.get("/View", view);

// Public || Start Attendance
router.post(
  "/StartorStopAttendance",
  [check("email", "value is Required").isString().isEmail()],
  [check("value", "value is Required").not().isEmpty()],
  startOrStopAttendance
);

router.post("/toggleAdminAttendance", [
  check("value", "value is required").isBoolean(),
  toggleAdminAttendance,
]);

module.exports = router;
