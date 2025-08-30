import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./src/routes";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
}));
// Explicitly set CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(express.json());
app.use("/api", router);
const PORT = process.env.BACKEND_URL;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

start();