const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const config = require("config");
const User = require("./../Schema/user");

var emailGlobal;

// Public || Start Attendance
router.post(
  "/StartorStopAttendance",
  [check("email", "email is Required").not().isEmpty()],
  [check("value", "value is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, value } = req.body;

    const result = await User.updateOne(
      { email },
      {
        $set: {
          start: value,
        },
      }
    );

    emailGlobal = email;
    return res.status(202).json({ message: value });
  }
);

// Public || Save Attendance
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
      const valuesArray = values.split(",");

      console.log(emailGlobal);
      console.table(valuesArray);

      let user = await User.findOne({ email: emailGlobal });

      let attendances = {};
      attendance.roll = valuesArray[0];
      attendance.name = valuesArray[1];
      attendance.branch = valuesArray[3];

      if (user) {
        if (user.start === "Start") {
          // const result = await User.updateOne(
          //   { email: emailGlobal },
          //   {
          //     $set: {
          //       attendance: value,
          //     },
          //   }
          // );

          return res.status(202).json("Success");
        }
      } else {
        return res.status(202).json("No User");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
);

module.exports = router;
