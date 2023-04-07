require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rishavrajcrj:UPqM67S6ndco02tf@attendance.2jrpkus.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
      }
    );
    console.log("DataBase Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
