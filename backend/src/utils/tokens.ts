import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" as any;
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" as any;

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as any;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as any;
}
