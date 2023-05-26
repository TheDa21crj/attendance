const express = require("express");
const router = express.Router();

// validator
const { check, validationResult } = require("express-validator");

// Schema
const User = require("./../Schema/user");

// middleware
const auth = require("./../middleware/UserAuth");

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
      attendances.roll = valuesArray[0];
      attendances.name = valuesArray[1].concat(" " + valuesArray[2]);
      attendances.branch = valuesArray[3];

      console.log(attendances);

      if (user) {
        if (user.start === "Start") {
          console.log(user.attendance.length);
          if (user.attendance.length === 0) {
            const result = await User.updateOne(
              { email: emailGlobal },
              {
                $set: {
                  attendance: attendances,
                },
              }
            );
            return res.status(202).json("Success");
          } else {
            let add = await User.findOneAndUpdate(
              { email: emailGlobal },
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

// auth
router.use(auth);

// Private || View Attendance
router.get("/View", async (req, res) => {
  const email = res.locals.userData.userEmail;

  // const result = await User.updateOne(
  //   { email },
  //   {
  //     $set: {
  //       start: value,
  //     },
  //   }
  // );

  emailGlobal = email;
  return res.status(202).json({ message: email });
});

module.exports = router;
