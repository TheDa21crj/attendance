require("dotenv").config();
const mongoose = require("mongoose");

const MONGOURI = process.env.MONGOURI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("DataBase Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
