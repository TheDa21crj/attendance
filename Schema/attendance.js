const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const Attendance = mongoose.model("attendance", attendanceSchema);

export default Attendance;
