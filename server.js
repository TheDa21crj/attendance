require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,OPTIONS"
  );

  next();
});

// connect to DB
connectDB().then((err) => {
  if (!err) {
    listen();
  } else {
    console.log(err);
  }
});

// init middleware
app.use(express.json({ extended: false }));

// cookieParser
app.use(cookieParser());

// routes
app.use("/api/user", require("./routes/user"));
app.use("/api/attendance", require("./routes/save"));

app.get("/test", (req, res) => {
  console.log("Test Route");
  return res.status(202).json({ message: "Hello World" });
});

app.get("/env", (req, res) => {
  return res.status(202).json({ message: `${process.env.AllowOrigin}` });
});

// PORT
const port = process.env.PORT || 5000;

function listen() {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
