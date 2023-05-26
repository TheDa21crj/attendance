const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  avatar: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  start: {
    type: "string",
    default: "stop",
  },
  attendance: [
    {
      name: {
        type: "string",
        required: true,
        default: "",
      },
      roll: {
        type: "string",
        required: true,
        default: "",
      },
      branch: {
        type: "string",
        required: true,
        default: "",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

// token
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = Users = mongoose.model("User", UserSchema);
