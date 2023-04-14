require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Origin",
    "attendance-production-1373.up.railway.app"
  );
  res.header("Access-Control-Allow-Credentials", true);
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
app.use("/api/attendance", require("./routes/save"));

app.get("/test", (req, res) => {
  return res.status(202).json({ message: "Hello World" });
});

// PORT
const port = process.env.PORT;

// listen
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
