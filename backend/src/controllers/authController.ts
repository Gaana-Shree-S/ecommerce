import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",

};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed });

    return res.status(201).json({ message: "User created", user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken({ userId: user._id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user._id, email: user.email });

    user.refreshTokens.push(refreshToken);

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,

    });

    return res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });


    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "User not found" });


    if (!user.refreshTokens.includes(token)) {

      user.refreshTokens = []; 
      await user.save();
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    const newRefreshToken = signRefreshToken({ userId: user._id, email: user.email });
    user.refreshTokens.push(newRefreshToken);
    await user.save();


    const newAccessToken = signAccessToken({ userId: user._id, email: user.email });
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {

      res.clearCookie("refreshToken", { path: "/" });
      return res.json({ message: "Logged out" });
    }

    const payload = (() => {
      try {
        return verifyRefreshToken(token);
      } catch {
        return null;
      }
    })();

    if (payload) {
      const user = await User.findById(payload.userId);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    }

    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
