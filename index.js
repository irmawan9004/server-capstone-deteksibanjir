import express from "express";
import dotenv from "dotenv";
import db from "./config/connection.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import cors from "cors";

// const express = require("express");
// const dotenv = require("dotenv");
// const db = require("./config/connection");
// const cookieParser = require("cookie-parser");
// const router = require("./routes/index");
// const cors = require("cors");

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  db.sync();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
