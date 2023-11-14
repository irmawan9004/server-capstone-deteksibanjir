import express from "express";
import dotenv from "dotenv";
import db from "./config/connection.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import cors from "cors";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  db.sync();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(
  cors({ credentials: true, origin: "https://deteksibanjirbendungan.online" })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server running on port 5000");
});
