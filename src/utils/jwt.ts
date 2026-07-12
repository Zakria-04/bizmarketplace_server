import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in the environment variables.");
}

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000 // 15 minutes;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days;

export const generateAccessToken = (payload: object) => {
  try {
    return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
  } catch (err) {
    throw err;
  }
};

export const generateRefreshToken = (payload: object) => {
  try {
    return jwt.sign(payload, refreshSecret, {
      expiresIn: "7d",
    });
  } catch (err) {
    throw err;
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessSecret);
  } catch (err) {
    throw err;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, refreshSecret);
  } catch (err) {
    throw err;
  }
};
