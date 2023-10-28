const { validationResult } = require("express-validator");
const AttendanceControl = require("../Schema/attendanceControl");
const Attendance = require("../Schema/attendance");
const User = require("../Schema/user");

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
    await User.updateOne(
      { email: res.locals.userData.userEmail },
      { start: value }
    );

    // emailGlobal = email;
    return res.status(202).json({ message: value });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "Some error occured." });
  }
}

/*
  Required values in request:
  {
    values : String of format - roll
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

    const user = await User.findOne({ roll: valuesArray[0] });

    let startValue = await AttendanceControl.findOne({});

    if (startValue == null) {
      const attControl = new AttendanceControl({ start: false });
      await attControl.save();
      startValue = attControl;
    }

    if (startValue.start && user.start) {
      const attendance = new Attendance({
        user: user._id,
        date: new Date(),
      });
      await attendance.save();
    } else {
      return res
        .status(403)
        .json({ message: "User not allowed to add attendance now." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

async function view(req, res) {
  try {
    const email = res.locals.userData.userEmail;
    const user = await User.findOne({ email });
    if (user) {
      const attendances = await Attendance.find({ user: user._id })
        .populate("user")
        .lean();
      const attandanceArr = [];
      for (let x of attendances) {
        attandanceArr.push({
          name: x.user.name,
          roll: x.user.roll,
          branch: x.user.branch,
          time: x.date.toTimeString().substring(0, 8),
          date: x.date.toDateString(),
        });
      }
      return res.status(202).json({ attandanceArr });
    } else {
      return res.status(202).json("No Such User");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "Some error occured." });
  }
}

async function toggleAdminAttendance(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { value } = req.body;
    const user = await User.findOne({
      email: res.locals.userData.userEmail,
    });
    if (user.role && user.role.includes("admin")) {
      let startValue = await AttendanceControl.findOne({});

      if (startValue == null) {
        const attControl = new AttendanceControl({ start: false });
        await attControl.save();
        startValue = attControl;
      }
      startValue.set("start", value);
      await startValue.save();
      return res.status(202).json({ message: value });
    } else {
      res.status(403).json({ err: "Admins only allowed" });
    }
  } catch (err) {
    console.log("[", Date(), "] : [", err, "]");
    return res.status(500).json({ err: "Some error occured." });
  }
}

module.exports = {
  startOrStopAttendance,
  start,
  view,
  toggleAdminAttendance,
};
