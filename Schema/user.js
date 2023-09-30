const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: "string",
    unique: true,
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
  roll: {
    type: Number,
    required: true,
    unique: true,
  },
  branch: {
    type: String,
    required: true,
  },
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
