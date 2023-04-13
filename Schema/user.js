const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  avatar: {
    type: "string",
    required: true,
  },
  tokens: [
    {
      token: {
        type: "string",
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

// token
UserSchema.methods.generateToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, config.get("jwtTokenAuth"));
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = Users = mongoose.model("User", UserSchema);