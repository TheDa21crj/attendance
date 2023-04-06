require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// connect to DB
connectDB();

// init middleware
app.use(express.json({ extended: false }));

// cookieParser
app.use(cookieParser());

// routes
app.use("/api/user", require("./routes/user"));

// PORT
const port = process.env.PORT;

// listen
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
