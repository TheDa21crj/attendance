const { validationResult } = require("express-validator");
const AttendanceControl = require("../Schema/attendanceControl");
const { default: Attendance } = require("../Schema/attendance");

const Users = require("../models/user");

/*
  Required values in request :
  {
    value: boolean
  }
  Sets the value of start value to true or fales
 */
async function startOrStopAttendance(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { value } = req.body;

    await AttendanceControl.updateOne({}, { start: value });

    emailGlobal = email;
    return res.status(202).json({ message: value });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "Some error occured." });
  }
}

/*
  Required values in request:
  {
    values : String of format - roll,name,branch
  }
 */
async function start(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { values } = req.body;

  try {
    const valuesArray = values.split(",");

    console.table(valuesArray);

    const user = await Users.findOne({ roll });

    const attendance = new Attendance({
      user: user._id,
      date: new Date(),
    });

    await attendance.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

async function view(req, res) {
  try {
    const email = req.locals.userData.userEmail;
    const user = await User.findOne({ email });
    if (user) {
      const attendances = Attendance.find({ user: user._id }).lean();
      return res.status(202).json({ message: attendances });
    } else {
      return res.status(202).json("No Such User");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "Some error occured." });
  }
}

module.exports = {
  startorStopAttendance: startOrStopAttendance,
  start,
  view,
};
