import { Request, Response, NextFunction } from "express";
import { UserModelType } from "../../types/user.type";
import { verifyAccessToken } from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      authUser: UserModelType;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const user = verifyAccessToken(token);
    req.authUser = user as UserModelType;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
