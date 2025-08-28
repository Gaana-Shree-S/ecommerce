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
  origin: "http://localhost:3000", 
  credentials: true, 
}));
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