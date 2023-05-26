const express = require("express");
const moment = require("moment");

const router = express.Router();

// validator
const { check, validationResult } = require("express-validator");

// Schema
const User = require("./../Schema/user");

// middleware
const auth = require("./../middleware/UserAuth");

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

// auth
router.use(auth);

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
      const email = res.locals.userData.userEmail;

      const valuesArray = values.split(",");

      console.table(valuesArray);

      let user = await User.findOne({ email });

      var date = moment().utc("Asia/Kolkata").format("DD-MM-yyyy").toString();

      let attendances = {};
      attendances.roll = valuesArray[0].trim();
      attendances.name = valuesArray[1].trim();
      attendances.branch = valuesArray[2].trim();
      attendances.date = date;

      console.log(attendances);

      if (user) {
        if (user.start === "Start") {
          console.log(user.attendance.length);
          if (user.attendance.length === 0) {
            const result = await User.updateOne(
              { email },
              {
                $set: {
                  attendance: attendances,
                },
              }
            );
            return res.status(202).json("Success");
          } else {
            let add = await User.findOneAndUpdate(
              { email },
              {
                $push: {
                  attendance: attendances,
                },
              }
            );
            return res.status(202).json("+ attendances");
          }
        } else {
          return res.status(202).json("Invalid Time");
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

// Private || View Attendance
router.get("/View", async (req, res) => {
  const email = res.locals.userData.userEmail;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(202).json({ message: user.attendance });
  } else {
    return res.status(202).json("No Such User");
  }
});

module.exports = router;
