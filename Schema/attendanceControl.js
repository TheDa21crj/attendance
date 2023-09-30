const mongoose = require("mongoose");

const attendanceControlSchema = new mongoose.Schema({
  start: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const AttendanceControl = mongoose.model(
  "attendanceControl",
  attendanceControlSchema
);

module.exports = AttendanceControl;
