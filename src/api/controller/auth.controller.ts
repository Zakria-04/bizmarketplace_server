import { Request, Response, NextFunction } from "express";
import { UserModelType } from "../../types/user.type";
import USER_MODEL from "../model/user.model";
import handleResponse from "../../utils/handleResponse";
import bcrypt from "bcryptjs";
import {
  ACCESS_TOKEN_MAX_AGE,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_MAX_AGE,
} from "../../utils/jwt";
import REFRESH_TOKEN_MODEL from "../model/refreshToken.model";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body as UserModelType;
  try {
    const existingUser = await USER_MODEL.findOne({ email });

    if (existingUser) {
      return handleResponse(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await USER_MODEL.create({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // generate tokens
    const payload = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await REFRESH_TOKEN_MODEL.create({
      userId: newUser._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    handleResponse(res, 201, "User Created Successfully");
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as UserModelType;
  try {
    const user = await USER_MODEL.findOne({ email });

    if (!user) {
      return handleResponse(res, 400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return handleResponse(res, 400, "Invalid email or password");
    }

    // generate tokens
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await REFRESH_TOKEN_MODEL.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    handleResponse(res, 200, "Login Successful");
  } catch (error) {
    next(error);
  }
};

export { register, login };
