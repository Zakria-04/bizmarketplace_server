import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import errorHandling from "./api/middlewares/errorHandler.middleware";
import Routes from "./api/routes/Routes";
import mongoose from "mongoose";
import { setServers } from "node:dns";

dotenv.config();

// if (process.platform === "win32" && process.env.NODE_ENV !== "production") {
//   setServers(["8.8.8.8", "8.8.4.4"]); //! You can uncomment this if you are facing DNS resolution issues on Windows in development mode.
// }
const app = express();

app.use(cookieParser());
// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(errorHandling);

// routes
app.use("/api", Routes);

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL is not defined in the environment variables.");
}

const retryTime = 1000 * 60; // if server is down it will try to connect again every 1 minute until connection
const connectWithRetry = async () => {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: retryTime,
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed. Retrying in 60 seconds...",
      (error as Error).message,
    );
    setTimeout(connectWithRetry, retryTime);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Retrying...");
  setTimeout(connectWithRetry, retryTime);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

app.get("/", (req, res) => {
  res.send("Server Is Running!");
});

connectWithRetry();

export default app;
